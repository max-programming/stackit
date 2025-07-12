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

// Hook for optimistic answer voting
export function useOptimisticAnswerVote(questionId: string) {
  const queryClient = useQueryClient();

  const updateAnswerOptimistically = (
    answerId: string,
    voteType: "up" | "down",
    currentAnswer: AnswerWithDetails
  ) => {
    const currentVote = currentAnswer.userVote;
    let newVoteCount = currentAnswer.voteCount;
    let newUserVote: "up" | "down" | null = voteType;

    if (currentVote === voteType) {
      // Remove vote if same type (toggle off)
      if (voteType === "up") {
        newVoteCount -= 1;
      } else {
        newVoteCount += 1; // Remove downvote = add 1
      }
      newUserVote = null;
    } else if (currentVote) {
      // Change vote type (from up to down or down to up)
      if (currentVote === "up" && voteType === "down") {
        // Remove upvote (-1) and add downvote (-1) = -2 total
        newVoteCount -= 2;
      } else if (currentVote === "down" && voteType === "up") {
        // Remove downvote (+1) and add upvote (+1) = +2 total
        newVoteCount += 2;
      }
    } else {
      // Add new vote (no previous vote)
      if (voteType === "up") {
        newVoteCount += 1;
      } else {
        newVoteCount -= 1;
      }
    }

    return {
      ...currentAnswer,
      voteCount: newVoteCount,
      userVote: newUserVote,
    };
  };

  const mutation = useMutation({
    mutationFn: ({
      answerId,
      voteType,
    }: {
      answerId: string;
      voteType: "up" | "down";
    }) => voteAnswer(answerId, voteType),
    onMutate: async ({ answerId, voteType }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["questions", questionId, "answers"],
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData([
        "questions",
        questionId,
        "answers",
      ]);

      // Optimistically update the answer in the infinite query
      queryClient.setQueryData(
        ["questions", questionId, "answers"],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              answers: page.answers.map((answer: AnswerWithDetails) => {
                if (answer.id === answerId) {
                  return updateAnswerOptimistically(answerId, voteType, answer);
                }
                return answer;
              }),
            })),
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(
          ["questions", questionId, "answers"],
          context.previousData
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state
      queryClient.invalidateQueries({
        queryKey: ["questions", questionId, "answers"],
      });
    },
  });

  return {
    voteAnswer: mutation.mutateAsync,
    isVoting: mutation.isPending,
    error: mutation.error,
  };
}
