import { useMutation, useQueryClient } from "@tanstack/react-query";
import { voteQuestion } from "~/lib/actions/questionVotes";
import type { QuestionWithDetails } from "~/lib/actions/questions";

// Query key factory
export const questionKeys = {
  all: ["questions"] as const,
  detail: (questionId: string) => [...questionKeys.all, questionId] as const,
  answers: (questionId: string) => [...questionKeys.all, questionId, "answers"] as const,
};

// Hook for optimistic question voting
export function useOptimisticQuestionVote(questionId: string, currentQuestion?: QuestionWithDetails) {
  const queryClient = useQueryClient();

  const updateQuestionOptimistically = (
    voteType: "up" | "down",
    question: QuestionWithDetails
  ) => {
    const currentVote = question.userVote;
    let newVoteCount = question.voteCount;
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
      ...question,
      voteCount: newVoteCount,
      userVote: newUserVote,
    };
  };

  const mutation = useMutation({
    mutationFn: ({ voteType }: { voteType: "up" | "down" }) =>
      voteQuestion(questionId, voteType),
    onMutate: async ({ voteType }) => {
      // For optimistic updates, we'll use the provided currentQuestion
      // since the question data might not be stored in React Query cache
      if (currentQuestion) {
        const optimisticQuestion = updateQuestionOptimistically(voteType, currentQuestion);
        
        // Update any query that might contain this question
        queryClient.setQueryData(questionKeys.detail(questionId), optimisticQuestion);
        
        return { previousQuestion: currentQuestion, optimisticQuestion };
      }
      
      return {};
    },
    onError: (err, variables, context) => {
      // If the mutation fails, we could trigger a refetch
      // but since we're not storing the question in cache, 
      // the parent component will handle the state
      console.error("Question voting failed:", err);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });

  return {
    voteQuestion: mutation.mutateAsync,
    isVoting: mutation.isPending,
    error: mutation.error,
  };
}

// Hook for voting on questions
export function useVoteQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      questionId,
      voteType,
    }: {
      questionId: string;
      voteType: "up" | "down";
    }) => voteQuestion(questionId, voteType),
    onSuccess: () => {
      // Invalidate and refetch questions
      queryClient.invalidateQueries({ queryKey: questionKeys.all });
    },
  });
}