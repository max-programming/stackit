import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  index,
  unique,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./auth";

// Enums
export const voteTypeEnum = pgEnum("vote_type", ["up", "down"]);
export const answerTypeEnum = pgEnum("answer_type", ["answer", "comment"]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "answer",
  "comment",
  "mention",
]);

// Tags table
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    nameIdx: index("tags_name_idx").on(table.name),
  })
);

// Questions table
export const questions = pgTable(
  "questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(), // Rich text content as HTML
    slug: text("slug").notNull().unique(), // URL-friendly version of title
    acceptedAnswerId: uuid("accepted_answer_id"), // Self-referencing to answers table
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("questions_user_id_idx").on(table.userId),
    slugIdx: index("questions_slug_idx").on(table.slug),
    createdAtIdx: index("questions_created_at_idx").on(table.createdAt),
  })
);

// Question Tags junction table
export const questionTags = pgTable(
  "question_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    questionTagUnique: unique().on(table.questionId, table.tagId),
    questionIdIdx: index("question_tags_question_id_idx").on(table.questionId),
    tagIdIdx: index("question_tags_tag_id_idx").on(table.tagId),
  })
);

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id").references((): AnyPgColumn => answers.id, {
      onDelete: "cascade",
    }), // For nested comments
    content: text("content").notNull(), // Rich text content as HTML
    answerType: answerTypeEnum("answer_type").default("answer").notNull(), // comment
    voteCount: integer("vote_count").default(0).notNull(),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    editedAt: timestamp("edited_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("answers_user_id_idx").on(table.userId),
    questionIdIdx: index("answers_question_id_idx").on(table.questionId),
    parentIdIdx: index("answers_parent_id_idx").on(table.parentId),
    answerTypeIdx: index("answers_answer_type_idx").on(table.answerType),
    createdAtIdx: index("answers_created_at_idx").on(table.createdAt),
    voteCountIdx: index("answers_vote_count_idx").on(table.voteCount),
  })
);

// Votes table
export const votes = pgTable(
  "votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // questionId: uuid("question_id").references(() => questions.id, {
    //   onDelete: "cascade",
    // }),
    answerId: uuid("answer_id").references(() => answers.id, {
      onDelete: "cascade",
    }),
    voteType: voteTypeEnum("vote_type").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    // userQuestionUnique: unique().on(table.userId, table.questionId),
    userAnswerUnique: unique().on(table.userId, table.answerId),
    userIdIdx: index("votes_user_id_idx").on(table.userId),
    // questionIdIdx: index("votes_question_id_idx").on(table.questionId),
    answerIdIdx: index("votes_answer_id_idx").on(table.answerId),
  })
);

// Notifications table
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    senderId: text("sender_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    type: notificationTypeEnum("type").notNull(),

    questionId: uuid("question_id").references(() => questions.id, {
      onDelete: "cascade",
    }),
    answerId: uuid("answer_id").references(() => answers.id, {
      onDelete: "cascade",
    }),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    recipientIdIdx: index("notifications_recipient_id_idx").on(
      table.recipientId
    ),
    senderIdIdx: index("notifications_sender_id_idx").on(table.senderId),
    typeIdx: index("notifications_type_idx").on(table.type),
    isReadIdx: index("notifications_is_read_idx").on(table.isRead),
    createdAtIdx: index("notifications_created_at_idx").on(table.createdAt),
  })
);

// Relations
export const tagsRelations = relations(tags, ({ many }) => ({
  questionTags: many(questionTags),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  user: one(users, {
    fields: [questions.userId],
    references: [users.id],
  }),
  questionTags: many(questionTags),
  answers: many(answers),
  votes: many(votes),
  notifications: many(notifications),
  acceptedAnswer: one(answers, {
    fields: [questions.acceptedAnswerId],
    references: [answers.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  questions: many(questions),
  answers: many(answers),
}));

export const questionTagsRelations = relations(questionTags, ({ one }) => ({
  question: one(questions, {
    fields: [questionTags.questionId],
    references: [questions.id],
  }),
  tag: one(tags, {
    fields: [questionTags.tagId],
    references: [tags.id],
  }),
}));

export const answersRelations = relations(answers, ({ one, many }) => ({
  user: one(users, {
    fields: [answers.userId],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id],
  }),
  parent: one(answers, {
    fields: [answers.parentId],
    references: [answers.id],
    relationName: "parent",
  }),
  children: many(answers, { relationName: "parent" }),
  votes: many(votes),
  notifications: many(notifications),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  // question: one(questions, {
  //   fields: [votes.questionId],
  //   references: [questions.id],
  // }),
  answer: one(answers, {
    fields: [votes.answerId],
    references: [answers.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  question: one(questions, {
    fields: [notifications.questionId],
    references: [questions.id],
  }),
  answer: one(answers, {
    fields: [notifications.answerId],
    references: [answers.id],
  }),
}));

// Types for better TypeScript support
export type Question = typeof questions.$inferSelect;
export type NewQuestion = typeof questions.$inferInsert;
export type Answer = typeof answers.$inferSelect;
export type NewAnswer = typeof answers.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;