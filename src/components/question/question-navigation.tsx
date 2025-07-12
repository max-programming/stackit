import { Button } from "~/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import Link from "next/link";

interface QuestionNavigationProps {
  questionTitle: string;
}

export function QuestionNavigation({ questionTitle }: QuestionNavigationProps) {
  return (
    <nav className="mb-6">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <Link href="/">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Button>
        </Link>

        <ChevronLeft className="w-4 h-4" />

        <Link href="/questions">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            Questions
          </Button>
        </Link>

        <ChevronLeft className="w-4 h-4" />

        <span className="text-foreground font-medium line-clamp-1">
          {questionTitle}
        </span>
      </div>
    </nav>
  );
}
