ALTER TABLE "questions" ADD COLUMN "vote_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "question_id" uuid;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_vote_count_idx" ON "questions" USING btree ("vote_count");--> statement-breakpoint
CREATE INDEX "votes_question_id_idx" ON "votes" USING btree ("question_id");--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_question_id_unique" UNIQUE("user_id","question_id");