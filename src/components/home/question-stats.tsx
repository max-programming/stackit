import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { MessageCircle, Eye, ArrowUp } from "lucide-react";
import { cn } from "~/lib/utils";

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

interface QuestionStatsProps {
  votes: number;
  answers: number;
  views: number;
  isAnswered: boolean;
}

export function QuestionStats({
  votes,
  answers,
  views,
  isAnswered,
}: QuestionStatsProps) {
  return (
    <div className="flex flex-row justify-center lg:flex-col gap-3 lg:gap-3 lg:items-center lg:min-w-[100px]">
      {/* Votes */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex lg:flex-col items-center gap-1 bg-muted/50 rounded-lg p-2.5 sm:p-3 min-w-[75px] sm:min-w-[80px]">
            <div className="flex items-center gap-1 lg:flex-col">
              <ArrowUp className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold text-foreground text-sm sm:text-base">
                {votes}
              </span>
              <span className="text-muted-foreground lg:hidden">
                {votes === 1 ? "Vote" : "Votes"}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{votes === 1 ? "Vote" : "Votes"}</p>
        </TooltipContent>
      </Tooltip>

      {/* Answers */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex lg:flex-col items-center gap-1 rounded-lg p-2.5 sm:p-3 min-w-[75px] sm:min-w-[80px]",
              answers > 0
                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                : "bg-muted/50 text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-1 lg:flex-col">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold text-sm sm:text-base">
                {answers}
              </span>
              <span className="text-muted-foreground lg:hidden">
                {answers === 1 ? "Answer" : "Answers"}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{answers === 1 ? "Answer" : "Answers"}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
