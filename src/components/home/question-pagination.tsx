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
    <div className="flex justify-center mt-12">
      <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 shadow-lg">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" className="hover:bg-accent" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="hover:bg-accent">
                10
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" className="hover:bg-accent" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
