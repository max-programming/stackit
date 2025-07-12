"use server";

import { db } from "~/lib/db";
import { answers, votes, questions } from "~/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "~/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export interface CreateAnswerData {
  questionId: string;
  content: string;
  parentId?: string;
  answerType?: "answer" | "comment";
}

export async function createAnswer(data: CreateAnswerData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const [newAnswer] = await db
      .insert(answers)
      .values({
        userId: session.user.id,
        questionId: data.questionId,
        parentId: data.parentId || null,
        content: data.content,
        answerType: data.answerType || "answer",
      })
      .returning();

    // Get the question slug for revalidation
    const question = await db
      .select({ slug: questions.slug })
      .from(questions)
      .where(eq(questions.id, data.questionId))
      .limit(1);

    if (question[0]) {
      revalidatePath(`/questions/${question[0].slug}`);
    }

    return { success: true, answer: newAnswer };
  } catch (error) {
    console.error("Error creating answer:", error);
    return { success: false, error: "Failed to create answer" };
  }
}

export async function voteAnswer(answerId: string, voteType: "up" | "down") {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Check if user already voted
    const existingVote = await db
      .select()
      .from(votes)
      .where(
        and(eq(votes.answerId, answerId), eq(votes.userId, session.user.id))
      )
      .limit(1);

    if (existingVote[0]) {
      // Update existing vote
      if (existingVote[0].voteType === voteType) {
        // Remove vote if same type
        await db
          .delete(votes)
          .where(
            and(eq(votes.answerId, answerId), eq(votes.userId, session.user.id))
          );

        // Update answer vote count
        await db
          .update(answers)
          .set({
            voteCount: sql`${answers.voteCount} - ${voteType === "up" ? 1 : -1}`,
          })
          .where(eq(answers.id, answerId));
      } else {
        // Change vote type
        await db
          .update(votes)
          .set({ voteType })
          .where(
            and(eq(votes.answerId, answerId), eq(votes.userId, session.user.id))
          );

        // Update answer vote count (change from -1 to 1 or 1 to -1)
        await db
          .update(answers)
          .set({
            voteCount: sql`${answers.voteCount} + ${voteType === "up" ? 2 : -2}`,
          })
          .where(eq(answers.id, answerId));
      }
    } else {
      // Create new vote
      await db.insert(votes).values({
        userId: session.user.id,
        answerId,
        voteType,
      });

      // Update answer vote count
      await db
        .update(answers)
        .set({
          voteCount: sql`${answers.voteCount} + ${voteType === "up" ? 1 : -1}`,
        })
        .where(eq(answers.id, answerId));
    }

    // Get the question slug for revalidation
    const answer = await db
      .select({
        questionId: answers.questionId,
        questionSlug: questions.slug,
      })
      .from(answers)
      .innerJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.id, answerId))
      .limit(1);

    if (answer[0]) {
      revalidatePath(`/questions/${answer[0].questionSlug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error voting on answer:", error);
    return { success: false, error: "Failed to vote on answer" };
  }
}

export async function acceptAnswer(answerId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const answer = await db
      .select({
        questionId: answers.questionId,
        questionSlug: questions.slug,
      })
      .from(answers)
      .innerJoin(questions, eq(answers.questionId, questions.id))
      .where(eq(answers.id, answerId))
      .limit(1);

    if (!answer[0]) {
      throw new Error("Answer not found");
    }

    const question = await db
      .select({ userId: questions.userId })
      .from(questions)
      .where(eq(questions.id, answer[0].questionId))
      .limit(1);

    if (!question[0] || question[0].userId !== session.user.id) {
      throw new Error("Unauthorized - only question owner can accept answers");
    }

    await db
      .update(questions)
      .set({ acceptedAnswerId: answerId })
      .where(eq(questions.id, answer[0].questionId));

    revalidatePath(`/questions/${answer[0].questionSlug}`);

    return { success: true };
  } catch (error) {
    console.error("Error accepting answer:", error);
    return { success: false, error: "Failed to accept answer" };
  }
}
