import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 sm:mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Question Cards Skeleton */}
        <div className="space-y-3 sm:space-y-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4 sm:p-6"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Stats Column */}
                <div className="flex lg:flex-col gap-4 lg:gap-2 lg:items-center lg:min-w-[120px]">
                  <div className="flex lg:flex-col items-center gap-1">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <div className="flex lg:flex-col items-center gap-1">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex lg:flex-col items-center gap-1">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 space-y-3">
                  {/* Title */}
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-3/4" />

                  {/* Description */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}
