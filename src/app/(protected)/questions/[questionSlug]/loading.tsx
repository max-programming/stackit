import { Skeleton } from "~/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question Header */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <div className="flex items-start gap-4">
                {/* Vote Column */}
                <div className="flex flex-col items-center gap-3 min-w-[60px]">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-8" />
                </div>

                {/* Question Content */}
                <div className="flex-1 space-y-4">
                  {/* Title */}
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-3/4" />

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 pt-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>

            {/* Answers Section */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-9 w-24" />
              </div>

              {/* Answer List */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="border-b border-border/50 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start gap-4">
                      {/* Vote Column */}
                      <div className="flex flex-col items-center gap-3 min-w-[60px]">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-8" />
                      </div>

                      {/* Answer Content */}
                      <div className="flex-1 space-y-4">
                        {/* Content */}
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-14" />
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <Skeleton className="h-6 w-32 mb-4" />

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50 mb-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <div className="w-px h-6 bg-border" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <div className="w-px h-6 bg-border" />
                <Skeleton className="h-8 w-8" />
              </div>

              {/* Textarea */}
              <Skeleton className="h-48 w-full mb-4" />

              {/* Button */}
              <div className="flex justify-end">
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6">
              <Skeleton className="h-6 w-32 mb-4" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
