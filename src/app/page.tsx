import { TooltipProvider } from "~/components/ui/tooltip";
import {
  QuestionHeader,
  QuestionFilters,
  QuestionCard,
  QuestionPagination,
  type Question,
} from "~/components/home";
import { db } from "~/lib/db";
import { questions, answers, users, questionTags, tags } from "~/lib/db/schema";
import { desc, count, sql, eq, and, lt, or, type SQL } from "drizzle-orm";
import { formatTimeAgo } from "~/lib/utils";

interface SearchParams {
  page?: string;
  limit?: string;
  sort?: string;
}

interface PaginationData {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalPages?: number;
}

// Simple in-memory cache for cursor mappings
// In production, use Redis or similar
const cursorCache = new Map<string, string>();

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { questionsData, pagination } = await getQuestions(params);
  console.log(questionsData);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <QuestionHeader
            title="Questions"
            description="Discover the most engaging discussions in our community"
          />

          {/* Filters and Search */}
          <QuestionFilters />

          {/* Questions List */}
          <div className="space-y-3 sm:space-y-4">
            {questionsData.map(question => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {/* Pagination */}
          <QuestionPagination
            currentPage={pagination.currentPage}
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

async function getQuestions(searchParams: SearchParams): Promise<{
  questionsData: Question[];
  pagination: PaginationData;
}> {
  const limit = parseInt(searchParams.limit || "10");
  const page = parseInt(searchParams.page || "1");
  const sort = searchParams.sort || "newest";

  // Get cursor for the current page
  const cacheKey = `page_${page}_limit_${limit}_sort_${sort}`;
  let cursor = cursorCache.get(cacheKey);

  // Parse cursor if exists
  let cursorDate: Date | null = null;
  let cursorId: string | null = null;

  if (cursor && page > 1) {
    try {
      const decoded = Buffer.from(cursor, "base64").toString("utf-8");
      const [dateStr, id] = decoded.split("|");
      cursorDate = new Date(dateStr);
      cursorId = id;
    } catch (error) {
      // Invalid cursor, ignore
    }
  }

  // Build where conditions
  const whereConditions: SQL[] = [];

  // Add cursor conditions for pagination
  if (cursorDate && cursorId && page > 1) {
    // For simplicity, we'll use creation date and ID for all sorting types
    // This ensures consistent pagination even if the sort values are the same
    whereConditions.push(
      or(
        lt(questions.createdAt, cursorDate),
        and(eq(questions.createdAt, cursorDate), lt(questions.id, cursorId))
      )!
    );
  }

  // Determine sort order
  let orderByConditions: SQL[];

  switch (sort) {
    case "votes":
      orderByConditions = [
        desc(sql<number>`COALESCE(SUM(${answers.voteCount}), 0)`),
        desc(questions.id),
      ];
      break;
    case "answers":
      orderByConditions = [
        desc(count(sql`DISTINCT ${answers.id}`)),
        desc(questions.id),
      ];
      break;
    case "newest":
    default:
      orderByConditions = [desc(questions.createdAt), desc(questions.id)];
      break;
  }

  // Build the query
  const baseQuery = db
    .select({
      id: questions.id,
      title: questions.title,
      description: sql<string>`CASE 
        WHEN LENGTH(${questions.description}) > 150 
        THEN SUBSTRING(${questions.description}, 1, 150) || '...'
        ELSE ${questions.description}
      END`,
      slug: questions.slug,
      createdAt: questions.createdAt,
      acceptedAnswerId: questions.acceptedAnswerId,
      userName: users.name,
      userImage: users.image,
      answerCount: count(sql`DISTINCT ${answers.id}`),
      totalVotes: questions.voteCount,
      tagNames: sql<string>`STRING_AGG(DISTINCT ${tags.name}, ',' ORDER BY ${tags.name})`,
    })
    .from(questions)
    .leftJoin(users, eq(questions.userId, users.id))
    .leftJoin(
      answers,
      and(
        eq(answers.questionId, questions.id),
        eq(answers.answerType, "answer"),
        eq(answers.isDeleted, false)
      )
    )
    .leftJoin(questionTags, eq(questionTags.questionId, questions.id))
    .leftJoin(tags, eq(tags.id, questionTags.tagId))
    .groupBy(
      questions.id,
      questions.title,
      questions.description,
      questions.slug,
      questions.createdAt,
      questions.acceptedAnswerId,
      users.name,
      users.image
    );

  // Apply where conditions if any
  const queryWithWhere =
    whereConditions.length > 0
      ? baseQuery.where(and(...whereConditions))
      : baseQuery;

  // Fetch one extra to check if there are more pages
  const results = await queryWithWhere
    .orderBy(...orderByConditions)
    .limit(limit + 1);

  // Determine if there are more pages
  const hasMore = results.length > limit;
  const questionsToShow = hasMore ? results.slice(0, limit) : results;

  // Cache cursor for next page
  if (hasMore && questionsToShow.length > 0) {
    const lastItem = questionsToShow[questionsToShow.length - 1];
    const cursorData = `${lastItem.createdAt.toISOString()}|${lastItem.id}`;
    const nextCursor = Buffer.from(cursorData).toString("base64");
    const nextPageKey = `page_${page + 1}_limit_${limit}_sort_${sort}`;
    cursorCache.set(nextPageKey, nextCursor);
  }

  // Transform to match the expected Question type
  const questionsData = questionsToShow.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    slug: q.slug,
    tags: q.tagNames ? q.tagNames.split(",").filter(Boolean) : [],
    user: q.userName || "Unknown User",
    answers: q.answerCount,
    votes: q.totalVotes,
    views: 0,
    timestamp: formatTimeAgo(q.createdAt),
    isAnswered: q.acceptedAnswerId !== null,
    difficulty: "intermediate",
  }));

  return {
    questionsData,
    pagination: {
      currentPage: page,
      hasNext: hasMore,
      hasPrevious: page > 1,
    },
  };
}
