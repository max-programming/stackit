import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { formatTimestamp } from "~/lib/utils/slug";
import type { AnswerWithDetails } from "~/lib/actions/questions";
import { useAnswerChildren, useCreateAnswer } from "~/lib/queries/answers";
import { AnswerForm } from "./answer-form";
import { Markdown } from "~/components/ui/markdown";

interface AnswerCardProps {
  answer: AnswerWithDetails;
  isQuestionOwner?: boolean;
  acceptedAnswerId?: string | null;
  onVote?: (answerId: string, voteType: "up" | "down") => void;
  onAccept?: (answerId: string) => void;
  questionId: string;
}

export function AnswerCard({
  answer,
  isQuestionOwner = false,
  acceptedAnswerId,
  onVote,
  onAccept,
  questionId,
}: AnswerCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: children, isLoading: loadingChildren } = useAnswerChildren(
    answer.id,
    showComments
  );

  const createAnswerMutation = useCreateAnswer();

  const handleVote = (voteType: "up" | "down") => {
    if (onVote) {
      onVote(answer.id, voteType);
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(answer.id);
    }
  };

  const handleSubmitComment = async (content: string) => {
    await createAnswerMutation.mutateAsync({
      questionId,
      parentId: answer.id,
      content,
      answerType: "comment",
    });
    setShowCommentForm(false);
  };

  const isAcceptedAnswer = acceptedAnswerId === answer.id;

  return (
    <div
      className={`bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 ${
        isAcceptedAnswer ? "border-green-500/50 bg-green-500/5" : ""
      }`}
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Stats Column */}
        <div className="flex lg:flex-col gap-4 lg:gap-2 lg:w-20 lg:shrink-0">
          <div className="flex flex-col items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 p-0 ${
                    answer.userVote === "up"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleVote("up")}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upvote this answer</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm font-semibold text-foreground">
              {answer.voteCount}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 p-0 ${
                    answer.userVote === "down"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleVote("down")}
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Downvote this answer</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 space-y-4">
          {/* Answer Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              {isAcceptedAnswer && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Accepted Answer</span>
                </div>
              )}
            </div>

            {isQuestionOwner && !isAcceptedAnswer && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                    onClick={handleAccept}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mark this as the best answer</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Answer Content */}
          <div className="text-muted-foreground leading-relaxed">
            <Markdown content={answer.content} className="prose-sm" />
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/users/${answer.user.id}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {answer.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium">{answer.user.name}</span>
              </Link>

              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(answer.createdAt)}</span>
              </div>

              {answer.childCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  <span>
                    {answer.childCount} comment
                    {answer.childCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3"
                onClick={() => setShowCommentForm(!showCommentForm)}
              >
                Comment
              </Button>

              {answer.childCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setShowComments(!showComments)}
                >
                  {showComments ? (
                    <>
                      <ChevronUp className="w-4 h-4 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4 mr-1" />
                      Show
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Comment Form */}
          {showCommentForm && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <AnswerForm
                onSubmit={handleSubmitComment}
                isSubmitting={createAnswerMutation.isPending}
              />
            </div>
          )}

          {/* Comments */}
          {showComments && (
            <div className="mt-4 space-y-4">
              {loadingChildren ? (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin"></div>
                    Loading comments...
                  </div>
                </div>
              ) : children && children.length > 0 ? (
                <div className="space-y-3 pl-4 border-l-2 border-border/50">
                  {children.map((child) => (
                    <div key={child.id} className="bg-card/40 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/users/${child.user.id}`}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <div className="w-5 h-5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">
                                {child.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <span className="text-sm font-medium">
                              {child.user.name}
                            </span>
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(child.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <Markdown content={child.content} className="prose-xs" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No comments yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
