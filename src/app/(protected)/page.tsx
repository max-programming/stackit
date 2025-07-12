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
import Link from "next/link";

const allQuestions = [
  {
    id: 1,
    title:
      "How to join 2 columns in a data set to make a separate column in SQL",
    description:
      "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column 1 containing First name, and column 2 consists of last name I want a column to combine",
    tags: ["SQL", "Data", "Beginner", "Join"],
    user: "Adnan Arodiya",
    answers: 5,
  },
  {
    id: 2,
    title: "How to use React Context for global state?",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    tags: ["React", "Context"],
    user: "Usman Sabuwala",
    answers: 3,
  },
  {
    id: 3,
    title: "How to optimize a slow API call?",
    description:
      "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
    tags: ["API", "Performance", "Optimization"],
    user: "Hussain Gagan",
    answers: 2,
  },
  {
    id: 4,
    title: "Best practices for TypeScript interfaces",
    description:
      "I'm learning TypeScript and want to understand the best practices for creating interfaces. What are some common patterns and anti-patterns?",
    tags: ["TypeScript", "Interfaces", "Best Practices"],
    user: "Sarah Johnson",
    answers: 8,
  },
  {
    id: 5,
    title: "How to implement authentication with JWT tokens?",
    description:
      "I need to implement user authentication in my Node.js application using JWT tokens. Can someone provide a step-by-step guide?",
    tags: ["Node.js", "JWT", "Authentication", "Security"],
    user: "Mike Chen",
    answers: 12,
  },
  {
    id: 6,
    title: "CSS Grid vs Flexbox: When to use which?",
    description:
      "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the differences and use cases?",
    tags: ["CSS", "Grid", "Flexbox", "Layout"],
    user: "Emily Davis",
    answers: 6,
  },
  {
    id: 7,
    title: "How to deploy a React app to Vercel?",
    description:
      "I've built a React application and want to deploy it to Vercel. What are the steps involved and any common issues to watch out for?",
    tags: ["React", "Vercel", "Deployment", "Frontend"],
    user: "Alex Thompson",
    answers: 4,
  },
  {
    id: 8,
    title: "Database normalization explained",
    description:
      "I'm studying database design and need help understanding normalization. Can someone explain the different normal forms with examples?",
    tags: ["Database", "SQL", "Normalization", "Design"],
    user: "David Wilson",
    answers: 9,
  },
  {
    id: 9,
    title: "How to handle errors in async/await functions?",
    description:
      "I'm using async/await in my JavaScript code but I'm not sure about the best way to handle errors. What are the recommended patterns?",
    tags: ["JavaScript", "Async/Await", "Error Handling"],
    user: "Lisa Brown",
    answers: 7,
  },
  {
    id: 10,
    title: "Setting up a CI/CD pipeline with GitHub Actions",
    description:
      "I want to set up continuous integration and deployment for my project using GitHub Actions. Can someone provide a basic workflow example?",
    tags: ["GitHub Actions", "CI/CD", "DevOps", "Automation"],
    user: "Robert Garcia",
    answers: 5,
  },
  {
    id: 11,
    title: "How to implement dark mode in a web app?",
    description:
      "I want to add dark mode functionality to my web application. What are the best approaches for implementing this feature?",
    tags: ["CSS", "Dark Mode", "UI/UX", "JavaScript"],
    user: "Jennifer Lee",
    answers: 11,
  },
  {
    id: 12,
    title: "Understanding React hooks: useEffect vs useState",
    description:
      "I'm learning React hooks and I'm confused about when to use useEffect vs useState. Can someone explain the differences?",
    tags: ["React", "Hooks", "useEffect", "useState"],
    user: "Kevin Martinez",
    answers: 6,
  },
  {
    id: 13,
    title: "How to optimize images for web performance?",
    description:
      "I want to improve my website's loading speed by optimizing images. What are the best practices and tools for image optimization?",
    tags: ["Performance", "Images", "Web Optimization", "SEO"],
    user: "Amanda White",
    answers: 8,
  },
  {
    id: 14,
    title: "Building a RESTful API with Express.js",
    description:
      "I'm building a REST API with Express.js and want to follow best practices. Can someone provide a comprehensive guide?",
    tags: ["Express.js", "REST API", "Node.js", "Backend"],
    user: "Chris Anderson",
    answers: 10,
  },
  {
    id: 15,
    title: "How to implement infinite scrolling?",
    description:
      "I want to implement infinite scrolling in my React application. What are the best approaches and libraries to use?",
    tags: ["React", "Infinite Scroll", "Performance", "UX"],
    user: "Rachel Green",
    answers: 4,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center px-2 py-6">
      {/* Filters and Search */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <div className="flex flex-1 gap-2 sm:gap-4">
          <Button
            asChild
            variant="default"
            className="flex-1 sm:flex-none h-full"
          >
            <Link href={"/"}>Ask New question</Link>
          </Button>
          <div className="hidden sm:inline-block">
            <Select defaultValue="newest">
              <SelectTrigger
                className="w-32 h-10"
                aria-label="Filter questions"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="more">More</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <form className="flex flex-1 gap-2">
          <Input placeholder="Search" className="flex-1" />
          <Button type="submit" variant="outline" className="px-3 h-full">
            🔍
          </Button>
        </form>
        {/* Mobile filter dropdown */}
        <div className="flex sm:hidden gap-2">
          <Button variant="outline">Filters</Button>
        </div>
      </div>

      {/* Questions List */}
      <div className="w-full max-w-3xl flex flex-col gap-4">
        {allQuestions.map(q => (
          <div
            key={q.id}
            className="rounded-lg border bg-card p-4 flex flex-col gap-2 sm:flex-row sm:items-center"
          >
            <div className="flex-1 space-x-3">
              <div className="font-semibold text-base truncate mb-2">
                {q.title}
              </div>
              <div className="flex gap-2 items-start">
                <div>
                  <div className="flex gap-2 flex-wrap">
                    {q.tags.slice(0, 2).map(tag => (
                      <Link
                        key={tag}
                        href={"/"}
                        className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground hover:underline hover:text-primary"
                        style={{ width: "fit-content" }}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                  {q.tags.length > 2 && (
                    <div className="mt-1">
                      <span
                        className="px-2 py-0.5 rounded bg-muted text-xs text-muted-foreground cursor-default"
                        style={{ width: "fit-content" }}
                      >
                        +{q.tags.length - 2}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mb-1 flex-1 line-clamp-3">
                  {q.description}
                </div>
              </div>
              <Link
                href={"/"}
                className="text-xs text-muted-foreground hover:underline hover:text-primary"
              >
                {q.user}
              </Link>
            </div>
            <div className="flex flex-row sm:flex-col items-center gap-2 sm:ml-4">
              <Button
                variant="secondary"
                className="px-3 py-1 text-xs cursor-default"
                disabled
              >
                {q.answers} ans
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="w-full max-w-3xl flex justify-center mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
