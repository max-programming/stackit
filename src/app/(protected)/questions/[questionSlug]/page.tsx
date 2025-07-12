import { notFound } from "next/navigation";
import { auth } from "~/lib/auth";
import { getQuestionBySlug, getQuestionAnswers } from "~/lib/actions/questions";
import { QuestionPageClient } from "./question-page-client";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    questionSlug: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function QuestionPage({
  params,
  searchParams,
}: PageProps) {
  const { questionSlug } = await params;
  const { page: searchPage } = await searchParams;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  const question = await getQuestionBySlug(questionSlug, userId);

  if (!question) {
    notFound();
  }

  const page = parseInt(searchPage || "1");
  const initialAnswers = await getQuestionAnswers(question.id, page);

  const isOwner = session?.user?.id === question.user.id;

  return (
    <QuestionPageClient
      question={question}
      initialAnswers={initialAnswers}
      userId={userId}
      isOwner={isOwner}
    />
  );
}
