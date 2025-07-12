import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteQuestion } from "~/lib/actions/questionVotes";
import type { QuestionWithDetails } from "~/lib/actions/questions";

export function useOptimisticQuestion(initialQuestion: QuestionWithDetails) {
  const [question, setQuestion] = useState(initialQuestion);
  const queryClient = useQueryClient();

  const updateQuestionOptimistically = useCallback(
    (voteType: "up" | "down") => {
      setQuestion((prevQuestion) => {
        const currentVote = prevQuestion.userVote;
        let newVoteCount = prevQuestion.voteCount;
        let newUserVote: "up" | "down" | null = voteType;

        if (currentVote === voteType) {
          // Remove vote if same type
          newVoteCount -= voteType === "up" ? 1 : -1;
          newUserVote = null;
        } else if (currentVote) {
          // Change vote type (from up to down or down to up)
          newVoteCount += voteType === "up" ? 2 : -2;
        } else {
          // Add new vote
          newVoteCount += voteType === "up" ? 1 : -1;
        }

        return {
          ...prevQuestion,
          voteCount: newVoteCount,
          userVote: newUserVote,
        };
      });
    },
    []
  );

  const voteQuestionMutation = useMutation({
    mutationFn: ({ voteType }: { voteType: "up" | "down" }) =>
      voteQuestion(question.id, voteType),
    onMutate: async ({ voteType }) => {
      // Optimistically update the UI
      updateQuestionOptimistically(voteType);
      
      // Return context for potential rollback
      return { previousQuestion: question };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousQuestion) {
        setQuestion(context.previousQuestion);
      }
      console.error("Question voting failed:", error);
    },
    onSettled: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const handleVoteQuestion = useCallback(
    async (voteType: "up" | "down") => {
      try {
        await voteQuestionMutation.mutateAsync({ voteType });
      } catch (error) {
        // Error is already handled in onError
      }
    },
    [voteQuestionMutation]
  );

  return {
    question,
    handleVoteQuestion,
    isVoting: voteQuestionMutation.isPending,
    error: voteQuestionMutation.error,
  };
}