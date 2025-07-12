import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        {/* Header Skeleton */}
        <div className="mb-10">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Form Card Skeleton */}
        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl">
          {/* Card Header */}
          <div className="p-6 pb-0">
            <Skeleton className="h-7 w-48" />
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* Title Section */}
            <div>
              <Skeleton className="h-6 w-20 mb-2" />
              <Skeleton className="h-4 w-80 mb-3" />
              <Skeleton className="h-12 w-full" />
            </div>

            {/* Description Section */}
            <div>
              <Skeleton className="h-6 w-28 mb-2" />
              <Skeleton className="h-4 w-96 mb-3" />

              {/* Toolbar Skeleton */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50 mb-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <div className="w-px h-6 bg-border" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <div className="w-px h-6 bg-border" />
                <Skeleton className="h-8 w-8" />
                <div className="w-px h-6 bg-border" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>

              {/* Textarea Skeleton */}
              <Skeleton className="h-80 w-full" />

              {/* Preview Skeleton */}
              <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                <Skeleton className="h-4 w-16 mb-2" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div>
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-4 w-80 mb-3" />
              <Skeleton className="h-12 w-full" />

              {/* Tag Preview */}
              <div className="mt-3 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex justify-end space-x-4 pt-4">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
