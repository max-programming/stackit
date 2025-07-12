"use client";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Plus, MessageCircle, Clock, Filter, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function QuestionFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");

  // Update URL when sort changes
  const updateURL = (newSort: string) => {
    const params = new URLSearchParams(searchParams);

    if (newSort && newSort !== "newest") {
      params.set("sort", newSort);
    } else {
      params.delete("sort");
    }

    // Reset page to 1 when sort changes
    params.delete("page");

    const newURL = params.toString() ? `/?${params.toString()}` : "/";
    router.push(newURL);
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURL(newSort);
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Left side - Ask Question button */}
        <Button
          asChild
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Link href="/ask" className="flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Ask Question
          </Link>
        </Button>

        {/* Right side - Sort dropdown */}
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-40 bg-background/50 backdrop-blur-sm border-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Newest
                </div>
              </SelectItem>
              <SelectItem value="votes">
                <div className="flex items-center gap-2">
                  <ArrowUp className="w-4 h-4" />
                  Most Votes
                </div>
              </SelectItem>
              <SelectItem value="answers">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Most Answers
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-accent sm:px-4"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
