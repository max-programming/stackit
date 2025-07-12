"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2, LogIn, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  AnswerCard,
  AnswerForm,
  AuthCheck,
  QuestionHeader,
  QuestionNavigation,
} from "~/components/question";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { TooltipProvider } from "~/components/ui/tooltip";
import { acceptAnswer, createAnswer, voteAnswer } from "~/lib/actions/answers";
import type {
  PaginatedAnswers,
  QuestionWithDetails,
} from "~/lib/actions/questions";
import { getQuestionAnswers } from "~/lib/actions/questions";

interface QuestionPageClientProps {
  question: QuestionWithDetails;
  initialAnswers: PaginatedAnswers;
  userId?: string;
  isOwner: boolean;
}

export function QuestionPageClient({
  question,
  initialAnswers,
  userId,
  isOwner,
}: QuestionPageClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Infinite query for answers
  const {
    data: answersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["questions", question.id, "answers"],
    queryFn: ({ pageParam = 1 }) =>
      getQuestionAnswers(question.id, pageParam, 10, userId),
    initialPageParam: 1,
    initialData: {
      pages: [initialAnswers],
      pageParams: [1],
    },
    getNextPageParam: (lastPage, pages) => {
      if (!lastPage.hasMore) return undefined;
      return pages.length + 1;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutations
  const createAnswerMutation = useMutation({
    mutationFn: createAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", question.id, "answers"],
      });
    },
  });

  const voteAnswerMutation = useMutation({
    mutationFn: ({
      answerId,
      voteType,
    }: {
      answerId: string;
      voteType: "up" | "down";
    }) => voteAnswer(answerId, voteType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["questions", question.id, "answers"],
      });
    },
  });

  const acceptAnswerMutation = useMutation({
    mutationFn: acceptAnswer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  const handleSubmitAnswer = async (content: string) => {
    setIsSubmitting(true);
    try {
      await createAnswerMutation.mutateAsync({
        questionId: question.id,
        content,
        answerType: "answer",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVoteAnswer = (answerId: string, voteType: "up" | "down") => {
    voteAnswerMutation.mutate({ answerId, voteType });
  };

  const handleAcceptAnswer = (answerId: string) => {
    acceptAnswerMutation.mutate(answerId);
  };

  // Flatten all answers from all pages
  const allAnswers = answersData?.pages.flatMap((page) => page.answers) || [];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Navigation */}
          <QuestionNavigation questionTitle={question.title} />

          {/* Question Header */}
          <QuestionHeader question={question} isOwner={isOwner} />

          {/* Answers Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {question.answerCount} Answer
                {question.answerCount !== 1 ? "s" : ""}
              </h2>

              {/* Sort Options */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Button variant="ghost" size="sm" className="h-8 px-3">
                  Votes
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-3">
                  Newest
                </Button>
                <Button variant="ghost" size="sm" className="h-8 px-3">
                  Oldest
                </Button>
              </div>
            </div>

            {/* Answers List */}
            {allAnswers.length > 0 ? (
              <div className="space-y-4">
                {allAnswers.map((answer) => (
                  <AnswerCard
                    key={answer.id}
                    answer={answer}
                    isQuestionOwner={isOwner}
                    isAccepted={!!question.acceptedAnswerId}
                    onVote={handleVoteAnswer}
                    onAccept={handleAcceptAnswer}
                    questionId={question.id}
                  />
                ))}
              </div>
            ) : !isLoading ? (
              <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No answers yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to answer this question!
                  </p>
                  {!userId && (
                    <Link href="/login">
                      <Button>
                        <LogIn className="w-4 h-4 mr-2" />
                        Log in to Answer
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  variant="outline"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Answers"
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Answer Form */}
          <div className="mt-8">
            <AuthCheck isAuthenticated={!!userId}>
              <AnswerForm
                onSubmit={handleSubmitAnswer}
                isSubmitting={isSubmitting}
              />
            </AuthCheck>
          </div>

          {/* Related Questions */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Related Questions
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Placeholder for related questions */}
              <div className="p-4 bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">
                  Related questions will appear here
                </h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>0 answers</span>
                  <span>0 votes</span>
                  <span>0 views</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
