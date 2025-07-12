import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Search,
  Plus,
  MessageCircle,
  Eye,
  Clock,
  Filter,
  TrendingUp,
  Users,
  ArrowUp,
} from "lucide-react";
import Link from "next/link";

export function QuestionFilters() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-xl p-6 mb-8 shadow-lg">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left side - Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ask Question
            </Link>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-accent"
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-accent"
            >
              <Users className="w-4 h-4" />
              Unanswered
            </Button>
          </div>
        </div>

        {/* Right side - Search and filters */}
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search questions, tags, or users..."
              className="pl-10 bg-background/50 backdrop-blur-sm border-muted/50 focus:border-primary/50 transition-colors"
            />
          </div>

          <Select defaultValue="newest">
            <SelectTrigger className="w-40 bg-background/50 backdrop-blur-sm border-muted/50">
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
              <SelectItem value="views">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Most Views
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            className="flex items-center gap-2 hover:bg-accent"
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
