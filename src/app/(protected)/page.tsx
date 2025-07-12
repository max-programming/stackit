import { TooltipProvider } from "~/components/ui/tooltip";
import {
  QuestionHeader,
  QuestionFilters,
  QuestionCard,
  QuestionPagination,
} from "~/components/home";
import { db } from "~/lib/db";
import { questions, answers, users, questionTags, tags } from "~/lib/db/schema";
import { desc, count, sql, eq, and } from "drizzle-orm";
import { formatTimeAgo } from "~/lib/utils";

export default async function HomePage() {
  const questionsData = await getQuestions();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <QuestionHeader
            title="Top Questions"
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
          <QuestionPagination />
        </div>
      </div>
    </TooltipProvider>
  );
}

async function getQuestions() {
  // Single optimized query with LEFT JOINs for questions, users, answers, and tags
  const questionsWithData = await db
    .select({
      id: questions.id,
      title: questions.title,
      // Truncate description at database level for efficiency
      description: sql<string>`CASE 
        WHEN LENGTH(${questions.description}) > 150 
        THEN SUBSTRING(${questions.description}, 1, 150) || '...'
        ELSE ${questions.description}
      END`,
      slug: questions.slug,
      createdAt: questions.createdAt,
      acceptedAnswerId: questions.acceptedAnswerId,
      // User information
      userName: users.name,
      userImage: users.image,
      // Answer count and vote aggregation
      answerCount: count(sql`DISTINCT ${answers.id}`),
      totalVotes: sql<number>`COALESCE(SUM(${answers.voteCount}), 0)`,
      // Tag aggregation using string_agg
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
    )
    .orderBy(desc(questions.createdAt))
    .limit(10);

  // Transform to match the expected Question type
  return questionsWithData.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    tags: q.tagNames ? q.tagNames.split(",").filter(Boolean) : [],
    user: q.userName || "Unknown User",
    answers: q.answerCount,
    votes: q.totalVotes,
    views: 0, // TODO: Add views when implementing view tracking
    timestamp: formatTimeAgo(q.createdAt),
    isAnswered: q.acceptedAnswerId !== null,
    difficulty: "intermediate", // TODO: Add difficulty when implementing this feature
  }));
}
