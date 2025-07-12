"use server";

import { and, asc, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "~/lib/db";
import {
  answers,
  questions,
  questionTags,
  tags,
  users,
  votes,
} from "~/lib/db/schema";
import { getQuestionUserVote } from "./questionVotes";

export interface QuestionWithDetails {
  id: string;
  title: string;
  description: string;
  slug: string;
  acceptedAnswerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  answerCount: number;
  voteCount: number;
  viewCount: number;
  userVote?: "up" | "down" | null;
}

export interface AnswerWithDetails {
  id: string;
  content: string;
  answerType: "answer" | "comment";
  voteCount: number;
  isDeleted: boolean;
  editedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
  childCount: number;
  userVote?: "up" | "down" | null;
}

export interface PaginatedAnswers {
  answers: AnswerWithDetails[];
  totalCount: number;
  hasMore: boolean;
}

export async function getQuestionBySlug(
  slug: string,
  userId?: string
): Promise<QuestionWithDetails | null> {
  try {
    const question = await db
      .select({
        id: questions.id,
        title: questions.title,
        description: questions.description,
        slug: questions.slug,
        acceptedAnswerId: questions.acceptedAnswerId,
        createdAt: questions.createdAt,
        updatedAt: questions.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(questions)
      .innerJoin(users, eq(questions.userId, users.id))
      .where(eq(questions.slug, slug))
      .limit(1);

    if (!question[0]) {
      return null;
    }

    // Get tags for the question
    const questionTagsData = await db
      .select({
        id: tags.id,
        name: tags.name,
      })
      .from(questionTags)
      .innerJoin(tags, eq(questionTags.tagId, tags.id))
      .where(eq(questionTags.questionId, question[0].id));

    // Get answer count
    const answerCountResult = await db
      .select({ count: count() })
      .from(answers)
      .where(
        and(eq(answers.questionId, question[0].id), isNull(answers.parentId))
      );

    // Get vote count (temporary placeholder until migration)
    const voteCount = 0;

    // Get view count (temporary placeholder until migration)
    const viewCount = 0;

    // Get user's vote if authenticated
    const userVote = await getQuestionUserVote(question[0].id, userId);

    return {
      ...question[0],
      tags: questionTagsData,
      answerCount: answerCountResult[0]?.count || 0,
      voteCount,
      viewCount,
      userVote,
    };
  } catch (error) {
    console.error("Error fetching question:", error);
    return null;
  }
}

export async function getQuestionAnswers(
  questionId: string,
  page: number = 1,
  pageSize: number = 10,
  userId?: string
): Promise<PaginatedAnswers> {
  try {
    const offset = (page - 1) * pageSize;

    // Get total count
    const totalCountResult = await db
      .select({ count: count() })
      .from(answers)
      .where(and(eq(answers.questionId, questionId), isNull(answers.parentId)));

    const totalCount = totalCountResult[0]?.count || 0;

    // Get answers with user data
    const answersData = await db
      .select({
        id: answers.id,
        content: answers.content,
        answerType: answers.answerType,
        voteCount: answers.voteCount,
        isDeleted: answers.isDeleted,
        editedAt: answers.editedAt,
        createdAt: answers.createdAt,
        updatedAt: answers.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(answers)
      .innerJoin(users, eq(answers.userId, users.id))
      .where(and(eq(answers.questionId, questionId), isNull(answers.parentId)))
      .orderBy(desc(answers.voteCount), desc(answers.createdAt))
      .limit(pageSize)
      .offset(offset);

    // Get child count for each answer
    const answersWithChildCount = await Promise.all(
      answersData.map(async (answer) => {
        const childCountResult = await db
          .select({ count: count() })
          .from(answers)
          .where(eq(answers.parentId, answer.id));

        // Get user's vote if authenticated
        let userVote: "up" | "down" | null = null;
        if (userId) {
          const userVoteResult = await db
            .select({ voteType: votes.voteType })
            .from(votes)
            .where(and(eq(votes.answerId, answer.id), eq(votes.userId, userId)))
            .limit(1);

          userVote = userVoteResult[0]?.voteType || null;
        }

        return {
          ...answer,
          childCount: childCountResult[0]?.count || 0,
          userVote,
        };
      })
    );

    return {
      answers: answersWithChildCount,
      totalCount,
      hasMore: offset + pageSize < totalCount,
    };
  } catch (error) {
    console.error("Error fetching answers:", error);
    return {
      answers: [],
      totalCount: 0,
      hasMore: false,
    };
  }
}

export async function getAnswerChildren(
  answerId: string,
  userId?: string
): Promise<AnswerWithDetails[]> {
  try {
    const children = await db
      .select({
        id: answers.id,
        content: answers.content,
        answerType: answers.answerType,
        voteCount: answers.voteCount,
        isDeleted: answers.isDeleted,
        editedAt: answers.editedAt,
        createdAt: answers.createdAt,
        updatedAt: answers.updatedAt,
        user: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(answers)
      .innerJoin(users, eq(answers.userId, users.id))
      .where(eq(answers.parentId, answerId))
      .orderBy(asc(answers.createdAt));

    // Get user's vote for each child if authenticated
    const childrenWithVotes = await Promise.all(
      children.map(async (child) => {
        let userVote: "up" | "down" | null = null;
        if (userId) {
          const userVoteResult = await db
            .select({ voteType: votes.voteType })
            .from(votes)
            .where(and(eq(votes.answerId, child.id), eq(votes.userId, userId)))
            .limit(1);

          userVote = userVoteResult[0]?.voteType || null;
        }

        return {
          ...child,
          childCount: 0, // Comments don't have children
          userVote,
        };
      })
    );

    return childrenWithVotes;
  } catch (error) {
    console.error("Error fetching answer children:", error);
    return [];
  }
}
