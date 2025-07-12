import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptAnswer, createAnswer, voteAnswer } from "~/lib/actions/answers";
import type { AnswerWithDetails } from "~/lib/actions/questions";
import { getAnswerChildren } from "~/lib/actions/questions";

// Query key factory
export const answerKeys = {
  all: ["answers"] as const,
  children: (answerId: string) =>
    [...answerKeys.all, "children", answerId] as const,
};

// Hook to fetch answer children (comments)
export function useAnswerChildren(answerId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: answerKeys.children(answerId),
    queryFn: () => getAnswerChildren(answerId),
    enabled: enabled && !!answerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook to create an answer
export function useCreateAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAnswer,
    onSuccess: (data, _variables) => {
      if (data.success) {
        // Invalidate and refetch the question data
        queryClient.invalidateQueries({ queryKey: ["questions"] });

        // If it's a comment, invalidate the parent answer's children
        if (_variables.parentId) {
          queryClient.invalidateQueries({
            queryKey: answerKeys.children(_variables.parentId),
          });
        }
      }
    },
  });
}

// Hook to vote on an answer
export function useVoteAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      answerId,
      voteType,
    }: {
      answerId: string;
      voteType: "up" | "down";
    }) => voteAnswer(answerId, voteType),
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the question data
        queryClient.invalidateQueries({ queryKey: ["questions"] });

        // Also invalidate any answer children queries that might be affected
        queryClient.invalidateQueries({ queryKey: answerKeys.all });
      }
    },
  });
}

// Hook to accept an answer
export function useAcceptAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptAnswer,
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch the question data
        queryClient.invalidateQueries({ queryKey: ["questions"] });
      }
    },
  });
}

// Optimistic update helper for votes
export function useOptimisticVote() {
  const queryClient = useQueryClient();

  const updateVoteOptimistically = (
    answerId: string,
    voteType: "up" | "down",
    questionId: string
  ) => {
    // Optimistically update the question data
    queryClient.setQueryData(["questions", questionId], (oldData: unknown) => {
      if (!oldData || typeof oldData !== "object" || oldData === null)
        return oldData;

      const data = oldData as { answers: AnswerWithDetails[] };
      return {
        ...data,
        answers: data.answers.map((answer: AnswerWithDetails) => {
          if (answer.id === answerId) {
            const currentVote = answer.userVote;
            let newVoteCount = answer.voteCount;

            if (currentVote === voteType) {
              // Remove vote
              newVoteCount -= voteType === "up" ? 1 : -1;
              return { ...answer, voteCount: newVoteCount, userVote: null };
            } else if (currentVote) {
              // Change vote
              newVoteCount += voteType === "up" ? 2 : -2;
              return { ...answer, voteCount: newVoteCount, userVote: voteType };
            } else {
              // Add new vote
              newVoteCount += voteType === "up" ? 1 : -1;
              return { ...answer, voteCount: newVoteCount, userVote: voteType };
            }
          }
          return answer;
        }),
      };
    });
  };

  return { updateVoteOptimistically };
}
