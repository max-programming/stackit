import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export function QuestionPagination() {
  return (
    <div className="flex justify-center mt-8 sm:mt-12">
      <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-3 sm:p-4 shadow-lg">
        <Pagination>
          <PaginationContent className="gap-1 sm:gap-2">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className="hover:bg-accent h-8 sm:h-10 px-2 sm:px-4"
              />
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#" className="hover:bg-accent h-8 sm:h-10">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent h-8 sm:h-10">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent h-8 sm:h-10">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem className="hidden sm:block">
              <PaginationLink href="#" className="hover:bg-accent h-8 sm:h-10">
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className="hover:bg-accent h-8 sm:h-10 px-2 sm:px-4"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
