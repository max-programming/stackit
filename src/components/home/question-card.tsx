import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Clock, Star, ArrowUp, ArrowDown } from "lucide-react";
import Link from "next/link";
import { QuestionStats } from "./question-stats";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

interface Question {
  id: number;
  title: string;
  description: string;
  tags: string[];
  user: string;
  answers: number;
  votes: number;
  views: number;
  timestamp: string;
  isAnswered: boolean;
  difficulty: string;
}

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="group bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/80 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Stats Column */}
        <QuestionStats
          votes={question.votes}
          answers={question.answers}
          views={question.views}
          isAnswered={question.isAnswered}
        />

        {/* Content Column */}
        <div className="flex-1 space-y-3 flex flex-col">
          <div className="flex flex-col gap-2 flex-1">
            {/* Question Title */}
            <Link href={`/questions/${question.id}`} className="block">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {question.title}
              </h3>
            </Link>

            {/* Question Description */}
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
              {question.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {question.tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${tag.toLowerCase()}`}
                className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors duration-200"
              >
                {tag}
              </Link>
            ))}

            {/* Difficulty Badge */}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </span>
          </div>

          {/* Meta Information */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href={`/users/${question.user
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {question.user
                      .split(" ")
                      .map(n => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium">{question.user}</span>
              </Link>

              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{question.timestamp}</span>
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

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upvote this question</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-muted-foreground hover:text-primary"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Downvote this question</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type { Question };
