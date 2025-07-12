import { TooltipProvider } from "~/components/ui/tooltip";
import {
  QuestionHeader,
  QuestionFilters,
  QuestionCard,
  QuestionPagination,
  allQuestions,
} from "~/components/home";

export default function HomePage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <QuestionHeader
            title="Top Questions"
            description="Discover the most engaging discussions in our community"
          />

          {/* Filters and Search */}
          <QuestionFilters />

          {/* Questions List */}
          <div className="space-y-4">
            {allQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {/* Pagination */}
          <QuestionPagination />
        </div>
      </div>
    </TooltipProvider>
  );
}
