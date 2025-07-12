"use server";

import { db } from "~/lib/db";
import { questions, votes } from "~/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { auth } from "~/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function voteQuestion(questionId: string, voteType: "up" | "down") {
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
        and(eq(votes.questionId, questionId), eq(votes.userId, session.user.id))
      )
      .limit(1);

    if (existingVote[0]) {
      // Update existing vote
      if (existingVote[0].voteType === voteType) {
        // Remove vote if same type
        await db
          .delete(votes)
          .where(
            and(eq(votes.questionId, questionId), eq(votes.userId, session.user.id))
          );

        // Update question vote count (when we have the column)
        // await db
        //   .update(questions)
        //   .set({
        //     voteCount: sql`${questions.voteCount} - ${voteType === "up" ? 1 : -1}`,
        //   })
        //   .where(eq(questions.id, questionId));
      } else {
        // Change vote type
        await db
          .update(votes)
          .set({ voteType })
          .where(
            and(eq(votes.questionId, questionId), eq(votes.userId, session.user.id))
          );

        // Update question vote count (when we have the column)
        // await db
        //   .update(questions)
        //   .set({
        //     voteCount: sql`${questions.voteCount} + ${voteType === "up" ? 2 : -2}`,
        //   })
        //   .where(eq(questions.id, questionId));
      }
    } else {
      // Create new vote
      await db.insert(votes).values({
        userId: session.user.id,
        questionId,
        voteType,
      });

      // Update question vote count (when we have the column)
      // await db
      //   .update(questions)
      //   .set({
      //     voteCount: sql`${questions.voteCount} + ${voteType === "up" ? 1 : -1}`,
      //   })
      //   .where(eq(questions.id, questionId));
    }

    // Get the question slug for revalidation
    const question = await db
      .select({ slug: questions.slug })
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (question[0]) {
      revalidatePath(`/questions/${question[0].slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error voting on question:", error);
    return { success: false, error: "Failed to vote on question" };
  }
}

export async function getQuestionUserVote(questionId: string, userId?: string): Promise<"up" | "down" | null> {
  if (!userId) return null;
  
  try {
    const userVoteResult = await db
      .select({ voteType: votes.voteType })
      .from(votes)
      .where(and(eq(votes.questionId, questionId), eq(votes.userId, userId)))
      .limit(1);

    return userVoteResult[0]?.voteType || null;
  } catch (error) {
    console.error("Error fetching user vote:", error);
    return null;
  }
}