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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Search,
  Plus,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  Eye,
  Clock,
  Filter,
  TrendingUp,
  Users,
  Star,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

const allQuestions = [
  {
    id: 1,
    title:
      "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combineI do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combineI do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combineI do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combineI do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine ",
    tags: ["SQL", "Data", "Beginner", "Join"],
    user: "Adnan Arodiya",
    answers: 5,
    votes: 12,
    views: 234,
    timestamp: "5 hours ago",
    isAnswered: true,
    difficulty: "beginner",
  },
  {
    id: 2,
    title: "How to use React Context for global state?",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    tags: ["React", "Context"],
    user: "Usman Sabuwala",
    answers: 3,
    votes: 8,
    views: 156,
    timestamp: "3 hours ago",
    isAnswered: false,
    difficulty: "intermediate",
  },
  {
    id: 3,
    title: "How to optimize a slow API call?",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    tags: ["API", "Performance", "Optimization"],
    user: "Hussain Gagan",
    answers: 2,
    votes: 24,
    views: 892,
    timestamp: "2 hours ago",
    isAnswered: true,
    difficulty: "advanced",
  },
  {
    id: 4,
    title: "Best practices for TypeScript interfaces",
    description:
      "I'm learning TypeScript and want to understand the best practices for creating interfaces. What are some common patterns and anti-patterns?",
    tags: ["TypeScript", "Interfaces", "Best Practices"],
    user: "Sarah Johnson",
    answers: 8,
    votes: 45,
    views: 1234,
    timestamp: "8 hours ago",
    isAnswered: true,
    difficulty: "intermediate",
  },
  {
    id: 5,
    title: "How to implement authentication with JWT tokens?",
    description:
      "I need to implement user authentication in my Node.js application using JWT tokens. Can someone provide a step-by-step guide?",
    tags: ["Node.js", "JWT", "Authentication", "Security"],
    user: "Mike Chen",
    answers: 12,
    votes: 67,
    views: 2156,
    timestamp: "12 hours ago",
    isAnswered: true,
    difficulty: "advanced",
  },
  {
    id: 6,
    title: "CSS Grid vs Flexbox: When to use which?",
    description:
      "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the differences and use cases?",
    tags: ["CSS", "Grid", "Flexbox", "Layout"],
    user: "Emily Davis",
    answers: 6,
    votes: 34,
    views: 678,
    timestamp: "6 hours ago",
    isAnswered: true,
    difficulty: "intermediate",
  },
  {
    id: 7,
    title: "How to deploy a React app to Vercel?",
    description:
      "I've built a React application and want to deploy it to Vercel. What are the steps involved and any common issues to watch out for?",
    tags: ["React", "Vercel", "Deployment", "Frontend"],
    user: "Alex Thompson",
    answers: 4,
    votes: 19,
    views: 445,
    timestamp: "4 hours ago",
    isAnswered: false,
    difficulty: "beginner",
  },
  {
    id: 8,
    title: "Database normalization explained",
    description:
      "I'm studying database design and need help understanding normalization. Can someone explain the different normal forms with examples?",
    tags: ["Database", "SQL", "Normalization", "Design"],
    user: "David Wilson",
    answers: 9,
    votes: 56,
    views: 1567,
    timestamp: "1 day ago",
    isAnswered: true,
    difficulty: "advanced",
  },
  {
    id: 9,
    title: "How to handle errors in async/await functions?",
    description:
      "I'm using async/await in my JavaScript code but I'm not sure about the best way to handle errors. What are the recommended patterns?",
    tags: ["JavaScript", "Async/Await", "Error Handling"],
    user: "Lisa Brown",
    answers: 7,
    votes: 28,
    views: 789,
    timestamp: "10 hours ago",
    isAnswered: true,
    difficulty: "intermediate",
  },
  {
    id: 10,
    title: "Setting up a CI/CD pipeline with GitHub Actions",
    description:
      "I want to set up continuous integration and deployment for my project using GitHub Actions. Can someone provide a basic workflow example?",
    tags: ["GitHub Actions", "CI/CD", "DevOps", "Automation"],
    user: "Robert Garcia",
    answers: 5,
    votes: 41,
    views: 923,
    timestamp: "7 hours ago",
    isAnswered: false,
    difficulty: "advanced",
  },
  {
    id: 11,
    title: "How to implement dark mode in a web app?",
    description:
      "I want to add dark mode functionality to my web application. What are the best approaches for implementing this feature?",
    tags: ["CSS", "Dark Mode", "UI/UX", "JavaScript"],
    user: "Jennifer Lee",
    answers: 11,
    votes: 73,
    views: 1845,
    timestamp: "2 days ago",
    isAnswered: true,
    difficulty: "intermediate",
  },
  {
    id: 12,
    title: "Understanding React hooks: useEffect vs useState",
    description:
      "I'm learning React hooks and I'm confused about when to use useEffect vs useState. Can someone explain the differences?",
    tags: ["React", "Hooks", "useEffect", "useState"],
    user: "Kevin Martinez",
    answers: 6,
    votes: 22,
    views: 567,
    timestamp: "9 hours ago",
    isAnswered: true,
    difficulty: "beginner",
  },
  {
    id: 13,
    title: "How to optimize images for web performance?",
    description:
      "I want to improve my website's loading speed by optimizing images. What are the best practices and tools for image optimization?",
    tags: ["Performance", "Images", "Web Optimization", "SEO"],
    user: "Amanda White",
    answers: 8,
    votes: 39,
    views: 1123,
    timestamp: "14 hours ago",
    isAnswered: true,
    difficulty: "intermediate",
  },
  {
    id: 14,
    title: "Building a RESTful API with Express.js",
    description:
      "I'm building a REST API with Express.js and want to follow best practices. Can someone provide a comprehensive guide?",
    tags: ["Express.js", "REST API", "Node.js", "Backend"],
    user: "Chris Anderson",
    answers: 10,
    votes: 58,
    views: 1689,
    timestamp: "1 day ago",
    isAnswered: true,
    difficulty: "advanced",
  },
  {
    id: 15,
    title: "How to implement infinite scrolling?",
    description:
      "I want to implement infinite scrolling in my React application. What are the best approaches and libraries to use?",
    tags: ["React", "Infinite Scroll", "Performance", "UX"],
    user: "Rachel Green",
    answers: 4,
    votes: 16,
    views: 334,
    timestamp: "5 hours ago",
    isAnswered: false,
    difficulty: "intermediate",
  },
];

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  }
}

function formatNumber(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export default function HomePage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Top Questions
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover the most engaging discussions in our community
            </p>
          </div>

          {/* Enhanced Filters and Search */}
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

          {/* Enhanced Questions List */}
          <div className="space-y-4">
            {allQuestions.map(question => (
              <div
                key={question.id}
                className="group bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:bg-card/80 hover:border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Stats Column */}
                  <div className="flex lg:flex-col gap-4 lg:gap-3 lg:items-center lg:min-w-[100px]">
                    {/* Votes */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex lg:flex-col items-center gap-1 bg-muted/50 rounded-lg p-3 min-w-[80px]">
                          <div className="flex items-center gap-1 lg:flex-col">
                            <ArrowUp className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">
                              {question.votes}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Community votes for this question</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Answers */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`flex lg:flex-col items-center gap-1 rounded-lg p-3 min-w-[80px] ${
                            question.isAnswered
                              ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400"
                              : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-1 lg:flex-col">
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-semibold">
                              {question.answers}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {question.isAnswered
                            ? "This question has been answered"
                            : "No answers yet"}
                        </p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Views */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex lg:flex-col items-center gap-1 bg-muted/50 rounded-lg p-3 min-w-[80px]">
                          <div className="flex items-center gap-1 lg:flex-col">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <span className="font-semibold text-foreground">
                              {formatNumber(question.views)}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Number of times this question has been viewed</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 space-y-3 flex flex-col">
                    <div className="flex flex-col gap-2 flex-1">
                      {/* Question Title */}
                      <Link
                        href={`/questions/${question.id}`}
                        className="block"
                      >
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {question.title}
                        </h3>
                      </Link>

                      {/* Question Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                        {question.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {question.tags.map(tag => (
                        <Link
                          key={tag}
                          href={`/tags/${tag.toLowerCase()}`}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full hover:bg-primary/20 transition-colors duration-200"
                        >
                          {tag}
                        </Link>
                      ))}

                      {/* Difficulty Badge */}
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(
                          question.difficulty
                        )}`}
                      >
                        {question.difficulty}
                      </span>
                    </div>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Link
                          href={`/users/${question.user
                            .replace(/\s+/g, "-")
                            .toLowerCase()}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <div className="w-6 h-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {question.user
                                .split(" ")
                                .map(n => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="font-medium">{question.user}</span>
                        </Link>

                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{question.timestamp}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-muted-foreground hover:text-primary"
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add to favorites</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-muted-foreground hover:text-primary"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Upvote this question</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 text-muted-foreground hover:text-primary"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Downvote this question</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Pagination */}
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
        </div>
      </div>
    </TooltipProvider>
  );
}
