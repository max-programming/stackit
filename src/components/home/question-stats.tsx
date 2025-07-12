import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { MessageCircle, Eye, ArrowUp } from "lucide-react";

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
    <div className="flex lg:flex-col gap-4 lg:gap-3 lg:items-center lg:min-w-[100px]">
      {/* Votes */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex lg:flex-col items-center gap-1 bg-muted/50 rounded-lg p-3 min-w-[80px]">
            <div className="flex items-center gap-1 lg:flex-col">
              <ArrowUp className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">{votes}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Community votes for this question</p>
        </TooltipContent>
      </Tooltip>

      {/* Answers */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`flex lg:flex-col items-center gap-1 rounded-lg p-3 min-w-[80px] ${
              isAnswered
                ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                : "bg-muted/50 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-1 lg:flex-col">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">{answers}</span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isAnswered ? "This question has been answered" : "No answers yet"}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Views */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex lg:flex-col items-center gap-1 bg-muted/50 rounded-lg p-3 min-w-[80px]">
            <div className="flex items-center gap-1 lg:flex-col">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold text-foreground">
                {formatNumber(views)}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Number of times this question has been viewed</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
