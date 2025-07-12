import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Clock, Star, ArrowUp, ArrowDown, CheckCircle } from "lucide-react";
import Link from "next/link";
import { formatTimestamp } from "~/lib/utils/slug";
import type { QuestionWithDetails } from "~/lib/actions/questions";

interface QuestionHeaderProps {
  question: QuestionWithDetails;
  isOwner?: boolean;
  onVote?: (voteType: "up" | "down") => void;
  userVote?: "up" | "down" | null;
}

export function QuestionHeader({
  question,
  isOwner = false,
  onVote,
  userVote,
}: QuestionHeaderProps) {
  const handleVote = (voteType: "up" | "down") => {
    if (onVote) {
      onVote(voteType);
    }
  };

  return (
    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 mb-6">
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
                    userVote === "up"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleVote("up")}
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upvote this question</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm font-semibold text-foreground">
              {question.voteCount}
            </span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-10 w-10 p-0 ${
                    userVote === "down"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                  onClick={() => handleVote("down")}
                >
                  <ArrowDown className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Downvote this question</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 space-y-4">
          {/* Question Title */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {question.title}
              </h1>
              {question.acceptedAnswerId && (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Answered</span>
                </div>
              )}
            </div>
          </div>

          {/* Question Description */}
          <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: question.description }} />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.name.toLowerCase()}`}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors duration-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/users/${question.user.id}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {question.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium">{question.user.name}</span>
              </Link>

              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{formatTimestamp(question.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <span>{question.viewCount} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to favorites</p>
                </TooltipContent>
              </Tooltip>

              {isOwner && (
                <Button variant="outline" size="sm">
                  Edit Question
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
