import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface QuestionPaginationProps {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export function QuestionPagination({
  currentPage,
  hasNext,
  hasPrevious,
}: QuestionPaginationProps) {
  // Generate clean URLs for pagination
  const nextUrl = hasNext ? `?page=${currentPage + 1}` : null;

  const prevUrl = hasPrevious
    ? currentPage === 2
      ? "/" // Go to first page without query params
      : `?page=${currentPage - 1}`
    : null;

  // Alternative: Route-based pagination (even cleaner)
  // const nextUrl = hasNext ? `/questions/page/${currentPage + 1}` : null;
  // const prevUrl = hasPrevious
  //   ? currentPage === 2
  //     ? "/questions"
  //     : `/questions/page/${currentPage - 1}`
  //   : null;

  // Don't render pagination if there are no navigation options
  if (!hasNext && !hasPrevious) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8 sm:mt-12">
      <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-3 sm:p-4 shadow-lg">
        <Pagination>
          <PaginationContent className="gap-1 sm:gap-2">
            <PaginationItem>
              <PaginationPrevious
                href={prevUrl || "#"}
                className={`hover:bg-accent h-8 sm:h-10 px-2 sm:px-4 ${
                  !prevUrl ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-disabled={!prevUrl}
              />
            </PaginationItem>

            {/* Show current page indicator */}
            <PaginationItem>
              <span className="flex items-center justify-center h-8 sm:h-10 px-3 sm:px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md">
                {currentPage}
              </span>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href={nextUrl || "#"}
                className={`hover:bg-accent h-8 sm:h-10 px-2 sm:px-4 ${
                  !nextUrl ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-disabled={!nextUrl}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
