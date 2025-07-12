import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "../src/lib/db";
import {
  users,
  accounts,
  tags,
  questions,
  answers,
  questionTags,
  votes,
  notifications,
} from "../src/lib/db/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt.toString("hex")}:${derivedKey.toString("hex")}`;
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getRandomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data in reverse dependency order
    console.log("🧹 Clearing existing data...");
    try {
      await db.delete(notifications);
      await db.delete(votes);
      await db.delete(questionTags);
      await db.delete(answers);
      await db.delete(questions);
      await db.delete(tags);
      await db.delete(accounts);
      await db.delete(users);
      console.log("✅ Successfully cleared existing data");
    } catch (deleteError) {
      console.log(
        "⚠️ Some tables might not exist yet, continuing with seeding..."
      );
    }

    // Generate 20 users
    console.log("👥 Seeding users...");
    const userNames = [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Brown",
      "Diana Prince",
      "Eve Wilson",
      "Frank Miller",
      "Grace Lee",
      "Henry Chen",
      "Ivy Rodriguez",
      "Jack Thompson",
      "Kate Williams",
      "Liam Davis",
      "Mia Garcia",
      "Noah Martinez",
      "Olivia Anderson",
      "Paul Jackson",
      "Quinn Taylor",
      "Rachel Green",
      "Sam Turner",
      "Tina White",
    ];

    const userIds: string[] = [];
    const userData = userNames.map((name, index) => {
      const userId = `user_${index + 1}`;
      userIds.push(userId);
      const firstName = name.split(" ")[0].toLowerCase();
      const lastName = name.split(" ")[1].toLowerCase();

      return {
        id: userId,
        name,
        email: `${firstName}.${lastName}@example.com`,
        emailVerified: Math.random() > 0.1, // 90% verified
        image: `https://images.unsplash.com/photo-${1494790108755 + index}?w=100&h=100&fit=crop&crop=face`,
        role: index === 0 ? "admin" : index === 1 ? "moderator" : "user",
        banned: index === 19 ? true : false, // Last user is banned
        banReason: index === 19 ? "Spam posting" : null,
        banExpires:
          index === 19 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      };
    });

    const insertedUsers = await db.insert(users).values(userData).returning();

    // Create accounts with passwords (password = email)
    console.log("🔐 Creating user accounts...");
    const accountData = [];
    for (let i = 0; i < insertedUsers.length; i++) {
      const user = insertedUsers[i];
      const firstName = user.name.split(" ")[0].toLowerCase();
      const lastName = user.name.split(" ")[1].toLowerCase();
      const email = `${firstName}.${lastName}@example.com`;

      try {
        const hashedPassword = await hashPassword(email);

        accountData.push({
          id: `account_${user.id}`,
          accountId: user.id,
          providerId: "credential",
          userId: user.id,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } catch (hashError) {
        console.error(
          `Failed to hash password for user ${user.name}:`,
          hashError
        );
        throw hashError;
      }
    }

    await db.insert(accounts).values(accountData);
    console.log(`✅ Created ${accountData.length} user accounts`);

    // Generate comprehensive tags
    console.log("🏷️  Seeding tags...");
    const tagData = [
      {
        name: "javascript",
        description: "Questions about JavaScript programming language",
      },
      { name: "react", description: "Questions about React.js library" },
      { name: "nextjs", description: "Questions about Next.js framework" },
      { name: "typescript", description: "Questions about TypeScript" },
      { name: "nodejs", description: "Questions about Node.js runtime" },
      { name: "css", description: "Questions about Cascading Style Sheets" },
      { name: "html", description: "Questions about HTML markup" },
      { name: "database", description: "Questions about databases and SQL" },
      { name: "api", description: "Questions about APIs and web services" },
      { name: "frontend", description: "Questions about frontend development" },
      { name: "backend", description: "Questions about backend development" },
      {
        name: "performance",
        description: "Questions about performance optimization",
      },
      {
        name: "debugging",
        description: "Questions about debugging and troubleshooting",
      },
      { name: "testing", description: "Questions about testing and QA" },
      {
        name: "deployment",
        description: "Questions about deployment and DevOps",
      },
      { name: "python", description: "Questions about Python programming" },
      { name: "java", description: "Questions about Java programming" },
      { name: "aws", description: "Questions about Amazon Web Services" },
      { name: "docker", description: "Questions about Docker containers" },
      { name: "git", description: "Questions about Git version control" },
      { name: "mongodb", description: "Questions about MongoDB database" },
      {
        name: "postgresql",
        description: "Questions about PostgreSQL database",
      },
      { name: "redis", description: "Questions about Redis caching" },
      { name: "graphql", description: "Questions about GraphQL APIs" },
      { name: "webpack", description: "Questions about Webpack bundling" },
    ];

    const insertedTags = await db.insert(tags).values(tagData).returning();

    // Generate 140 questions with realistic topics
    console.log("❓ Seeding questions...");
    const questionTemplates = [
      // React/Frontend
      {
        title: "How to optimize React component re-renders?",
        topic: "react",
        tags: ["react", "javascript", "performance"],
      },
      {
        title: "Best practices for state management in React",
        topic: "react",
        tags: ["react", "javascript", "frontend"],
      },
      {
        title: "Understanding React hooks lifecycle",
        topic: "react",
        tags: ["react", "javascript"],
      },
      {
        title: "How to handle form validation in React?",
        topic: "react",
        tags: ["react", "frontend"],
      },
      {
        title: "React Context vs Redux: When to use which?",
        topic: "react",
        tags: ["react", "javascript"],
      },
      {
        title: "Implementing lazy loading in React applications",
        topic: "react",
        tags: ["react", "performance"],
      },
      {
        title: "How to test React components effectively?",
        topic: "react",
        tags: ["react", "testing"],
      },
      {
        title: "React Router navigation best practices",
        topic: "react",
        tags: ["react", "frontend"],
      },
      {
        title: "Handling async operations in React",
        topic: "react",
        tags: ["react", "javascript"],
      },
      {
        title: "React performance optimization techniques",
        topic: "react",
        tags: ["react", "performance"],
      },

      // Next.js
      {
        title: "Next.js vs Create React App: Which should I choose?",
        topic: "nextjs",
        tags: ["nextjs", "react", "frontend"],
      },
      {
        title: "Server-side rendering best practices in Next.js",
        topic: "nextjs",
        tags: ["nextjs", "performance"],
      },
      {
        title: "How to implement authentication in Next.js?",
        topic: "nextjs",
        tags: ["nextjs", "backend"],
      },
      {
        title: "Next.js API routes vs separate backend",
        topic: "nextjs",
        tags: ["nextjs", "api", "backend"],
      },
      {
        title: "Static generation vs server-side rendering in Next.js",
        topic: "nextjs",
        tags: ["nextjs", "performance"],
      },

      // TypeScript
      {
        title: "Understanding TypeScript generics with practical examples",
        topic: "typescript",
        tags: ["typescript", "javascript"],
      },
      {
        title: "TypeScript utility types explained",
        topic: "typescript",
        tags: ["typescript", "javascript"],
      },
      {
        title: "How to type React components in TypeScript?",
        topic: "typescript",
        tags: ["typescript", "react"],
      },
      {
        title: "Advanced TypeScript patterns for APIs",
        topic: "typescript",
        tags: ["typescript", "api"],
      },
      {
        title: "TypeScript vs JavaScript: Migration strategies",
        topic: "typescript",
        tags: ["typescript", "javascript"],
      },

      // Backend/API
      {
        title: "Best practices for REST API design",
        topic: "api",
        tags: ["api", "backend"],
      },
      {
        title: "GraphQL vs REST: Pros and cons",
        topic: "api",
        tags: ["graphql", "api", "backend"],
      },
      {
        title: "How to handle authentication in Node.js?",
        topic: "nodejs",
        tags: ["nodejs", "backend"],
      },
      {
        title: "Database connection pooling strategies",
        topic: "database",
        tags: ["database", "backend", "performance"],
      },
      {
        title: "Implementing rate limiting in APIs",
        topic: "api",
        tags: ["api", "backend", "performance"],
      },
      {
        title: "Microservices architecture patterns",
        topic: "backend",
        tags: ["backend", "api"],
      },
      {
        title: "Error handling in Node.js applications",
        topic: "nodejs",
        tags: ["nodejs", "backend", "debugging"],
      },

      // CSS/Frontend
      {
        title: "CSS Grid vs Flexbox: When to use which?",
        topic: "css",
        tags: ["css", "frontend"],
      },
      {
        title: "Responsive design best practices",
        topic: "css",
        tags: ["css", "frontend"],
      },
      {
        title: "CSS animations performance optimization",
        topic: "css",
        tags: ["css", "performance", "frontend"],
      },
      {
        title: "Modern CSS layout techniques",
        topic: "css",
        tags: ["css", "frontend"],
      },
      {
        title: "CSS-in-JS vs traditional CSS",
        topic: "css",
        tags: ["css", "javascript", "frontend"],
      },

      // Database
      {
        title: "Database indexing strategies for performance",
        topic: "database",
        tags: ["database", "performance"],
      },
      {
        title: "SQL vs NoSQL: Choosing the right database",
        topic: "database",
        tags: ["database", "mongodb", "postgresql"],
      },
      {
        title: "Database migration best practices",
        topic: "database",
        tags: ["database", "backend"],
      },
      {
        title: "Optimizing PostgreSQL queries",
        topic: "database",
        tags: ["postgresql", "database", "performance"],
      },
      {
        title: "Redis caching strategies",
        topic: "database",
        tags: ["redis", "database", "performance"],
      },

      // DevOps/Deployment
      {
        title: "Docker containerization best practices",
        topic: "deployment",
        tags: ["docker", "deployment"],
      },
      {
        title: "AWS deployment strategies for web apps",
        topic: "deployment",
        tags: ["aws", "deployment"],
      },
      {
        title: "CI/CD pipeline setup for Node.js apps",
        topic: "deployment",
        tags: ["deployment", "nodejs"],
      },
      {
        title: "Monitoring and logging in production",
        topic: "deployment",
        tags: ["deployment", "backend"],
      },

      // Testing
      {
        title: "Testing strategies for React applications",
        topic: "testing",
        tags: ["react", "testing"],
      },
      {
        title: "Unit vs integration vs E2E testing",
        topic: "testing",
        tags: ["testing"],
      },
      {
        title: "API testing best practices",
        topic: "testing",
        tags: ["testing", "api"],
      },
      {
        title: "Test-driven development in JavaScript",
        topic: "testing",
        tags: ["testing", "javascript"],
      },

      // Performance
      {
        title: "Web application performance optimization",
        topic: "performance",
        tags: ["performance", "frontend"],
      },
      {
        title: "Bundle size optimization techniques",
        topic: "performance",
        tags: ["performance", "webpack", "frontend"],
      },
      {
        title: "Database query optimization",
        topic: "performance",
        tags: ["performance", "database"],
      },
      {
        title: "Caching strategies for web applications",
        topic: "performance",
        tags: ["performance", "backend", "redis"],
      },

      // Python
      {
        title: "Python vs JavaScript for backend development",
        topic: "python",
        tags: ["python", "javascript", "backend"],
      },
      {
        title: "Django vs Flask: Which to choose?",
        topic: "python",
        tags: ["python", "backend"],
      },
      {
        title: "Python data structures optimization",
        topic: "python",
        tags: ["python", "performance"],
      },

      // Git/Version Control
      {
        title: "Git workflow best practices for teams",
        topic: "git",
        tags: ["git"],
      },
      {
        title: "Resolving complex Git merge conflicts",
        topic: "git",
        tags: ["git", "debugging"],
      },
      { title: "Git branching strategies", topic: "git", tags: ["git"] },
    ];

    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() - 6); // Start 6 months ago
    const questionData = [];
    const usedSlugs = new Set(); // Track used slugs to ensure uniqueness

    for (let i = 0; i < 140; i++) {
      const template = getRandomElement(questionTemplates);
      const randomUserId = getRandomElement(userIds.slice(0, -1)); // Exclude banned user
      const createdAt = getRandomDate(baseDate, new Date());

      const variations = [
        `${template.title}`,
        `${template.title} - Need help!`,
        `${template.title} in 2024`,
        `Advanced ${template.title.toLowerCase()}`,
        `Beginner's guide to ${template.title.toLowerCase()}`,
        `How to ${template.title.toLowerCase().replace("how to ", "")}`,
        `Best approach for ${template.title.toLowerCase().replace(/^(how to|best practices for|understanding) /, "")}`,
        `${template.title} - Performance considerations`,
        `${template.title} - Common pitfalls`,
        `${template.title} - Modern approach`,
      ];

      const title =
        i < questionTemplates.length
          ? template.title
          : getRandomElement(variations);

      // Generate unique slug
      let baseSlug = createSlug(title);
      let slug = baseSlug;
      let counter = 1;

      // Keep adding counter until we get a unique slug
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      usedSlugs.add(slug);

      questionData.push({
        userId: randomUserId,
        title,
        description: `I'm working on a project and need help with ${template.topic}. ${generateQuestionDescription(template.topic)}`,
        slug: slug,
        createdAt,
        updatedAt: createdAt,
      });
    }

    const insertedQuestions = await db
      .insert(questions)
      .values(questionData)
      .returning();

    // Generate answers (2-5 answers per question on average)
    console.log("💬 Seeding answers...");
    const answerData = [];

    for (const question of insertedQuestions) {
      const numAnswers = Math.floor(Math.random() * 4) + 1; // 1-4 answers per question
      const questionDate = new Date(question.createdAt);

      for (let i = 0; i < numAnswers; i++) {
        const answererUserId = getRandomElement(
          userIds.filter((id) => id !== question.userId).slice(0, -1)
        );
        const answerDate = getRandomDate(questionDate, new Date());
        const isAccepted = i === 0 && Math.random() > 0.7; // 30% chance first answer is accepted

        answerData.push({
          userId: answererUserId,
          questionId: question.id,
          content: generateAnswerContent(),
          answerType: "answer" as const,
          voteCount: Math.floor(Math.random() * 25) - 5, // -5 to 20 votes
          isDeleted: false,
          createdAt: answerDate,
          updatedAt: answerDate,
        });
      }
    }

    const insertedAnswers = await db
      .insert(answers)
      .values(answerData)
      .returning();

    // Generate comments (30% of answers get comments)
    console.log("💬 Seeding comments...");
    const commentData = [];

    for (const answer of insertedAnswers) {
      if (Math.random() < 0.3) {
        // 30% chance of getting comments
        const numComments = Math.floor(Math.random() * 3) + 1; // 1-3 comments
        const answerDate = new Date(answer.createdAt);

        for (let i = 0; i < numComments; i++) {
          const commenterUserId = getRandomElement(
            userIds.filter((id) => id !== answer.userId).slice(0, -1)
          );
          const commentDate = getRandomDate(answerDate, new Date());

          commentData.push({
            userId: commenterUserId,
            questionId: answer.questionId,
            parentId: answer.id,
            content: generateCommentContent(),
            answerType: "comment" as const,
            voteCount: Math.floor(Math.random() * 10), // 0-9 votes
            isDeleted: false,
            createdAt: commentDate,
            updatedAt: commentDate,
          });
        }
      }
    }

    if (commentData.length > 0) {
      await db.insert(answers).values(commentData);
    }

    // Update questions with accepted answers
    console.log("✅ Setting accepted answers...");
    for (const question of insertedQuestions) {
      if (Math.random() > 0.6) {
        // 40% of questions have accepted answers
        const questionAnswers = insertedAnswers.filter(
          (a) => a.questionId === question.id
        );
        if (questionAnswers.length > 0) {
          const acceptedAnswer = getRandomElement(questionAnswers);
          await db
            .update(questions)
            .set({ acceptedAnswerId: acceptedAnswer.id })
            .where(eq(questions.id, question.id));
        }
      }
    }

    // Generate question tags
    console.log("🔗 Seeding question tags...");
    const questionTagData = [];

    for (let i = 0; i < insertedQuestions.length; i++) {
      const question = insertedQuestions[i];
      const template = questionTemplates[i % questionTemplates.length];
      const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags per question
      const selectedTags = getRandomElements(
        insertedTags.filter((tag) => template.tags.includes(tag.name)),
        Math.min(numTags, template.tags.length)
      );

      // Add additional random tags if needed
      if (selectedTags.length < numTags) {
        const additionalTags = getRandomElements(
          insertedTags.filter((tag) => !selectedTags.includes(tag)),
          numTags - selectedTags.length
        );
        selectedTags.push(...additionalTags);
      }

      for (const tag of selectedTags) {
        questionTagData.push({
          questionId: question.id,
          tagId: tag.id,
          createdAt: question.createdAt,
        });
      }
    }

    await db.insert(questionTags).values(questionTagData);

    // Generate realistic votes
    console.log("👍 Seeding votes...");
    const voteData = [];
    const allAnswers = [...insertedAnswers, ...commentData];

    for (const answer of allAnswers) {
      const numVotes = Math.abs(answer.voteCount); // Use the vote count we set earlier
      const upvoteRatio = answer.voteCount >= 0 ? 0.8 : 0.2; // Positive answers get more upvotes

      const voters = getRandomElements(
        userIds.filter((id) => id !== answer.userId).slice(0, -1),
        Math.min(numVotes, userIds.length - 2)
      );

      for (let i = 0; i < voters.length; i++) {
        const voteType = Math.random() < upvoteRatio ? "up" : "down";
        const answerDate = new Date(answer.createdAt);
        const voteDate = getRandomDate(answerDate, new Date());

        voteData.push({
          userId: voters[i],
          answerId: (answer as any).id,
          voteType: voteType as "up" | "down",
          createdAt: voteDate,
        });
      }
    }

    await db.insert(votes).values(voteData);

    // Generate notifications
    console.log("🔔 Seeding notifications...");
    const notificationData = [];

    // Answer notifications
    for (const answer of insertedAnswers) {
      const question = insertedQuestions.find(
        (q) => q.id === answer.questionId
      );
      if (question && answer.userId !== question.userId) {
        notificationData.push({
          recipientId: question.userId,
          senderId: answer.userId,
          type: "answer" as const,
          questionId: question.id,
          answerId: answer.id,
          isRead: Math.random() > 0.4, // 60% read
          createdAt: answer.createdAt,
        });
      }
    }

    // Comment notifications
    for (const comment of commentData) {
      const parentAnswer = insertedAnswers.find(
        (a) => a.id === comment.parentId
      );
      if (parentAnswer && comment.userId !== parentAnswer.userId) {
        notificationData.push({
          recipientId: parentAnswer.userId,
          senderId: comment.userId,
          type: "comment" as const,
          questionId: comment.questionId,
          answerId: (comment as any).id,
          isRead: Math.random() > 0.5, // 50% read
          createdAt: comment.createdAt,
        });
      }
    }

    if (notificationData.length > 0) {
      await db.insert(notifications).values(notificationData);
    }

    console.log("✅ Database seeding completed successfully!");
    console.log(`📊 Seeded data summary:`);
    console.log(`   👥 Users: ${insertedUsers.length}`);
    console.log(`   🔐 Accounts: ${accountData.length}`);
    console.log(`   🏷️  Tags: ${insertedTags.length}`);
    console.log(`   ❓ Questions: ${insertedQuestions.length}`);
    console.log(`   💬 Answers: ${insertedAnswers.length}`);
    console.log(`   💬 Comments: ${commentData.length}`);
    console.log(`   🔗 Question Tags: ${questionTagData.length}`);
    console.log(`   👍 Votes: ${voteData.length}`);
    console.log(`   🔔 Notifications: ${notificationData.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

function generateQuestionDescription(topic: string): string {
  const descriptions = {
    react:
      "\n\nI'm having trouble understanding how to properly structure my React components and manage state efficiently. Any guidance would be appreciated.\n\n**Specific areas I need help with:**\n- Component organization\n- State management patterns\n- Performance optimization",
    nextjs:
      "\n\nI need to understand the best practices for building production-ready applications with Next.js.\n\n**My project requirements:**\n- Server-side rendering\n- API routes\n- SEO optimization\n- Performance considerations",
    typescript:
      "\n\nI'm transitioning from JavaScript and finding TypeScript's type system challenging to master.\n\n**Topics I'm struggling with:**\n- Generic types\n- Interface definitions\n- Type inference\n- Migration strategies",
    api: "\n\nI want to ensure my API follows industry standards and is scalable for future growth.\n\n**Key considerations:**\n- RESTful design principles\n- Error handling\n- Authentication\n- Documentation",
    nodejs:
      "\n\nI'm building a backend service and need advice on the most effective patterns and practices.\n\n**Areas of focus:**\n- Architecture patterns\n- Error handling\n- Security best practices\n- Performance optimization",
    css: "\n\nI'm working on responsive layouts and want to use modern CSS techniques effectively.\n\n**What I want to learn:**\n- Grid vs Flexbox usage\n- Mobile-first design\n- CSS custom properties\n- Animation techniques",
    database:
      "\n\nMy application's data requirements are growing and I need to optimize for performance and scalability.\n\n**Current challenges:**\n- Query optimization\n- Index strategies\n- Schema design\n- Connection pooling",
    testing:
      "\n\nI want to implement comprehensive testing but I'm not sure about the best strategies and tools.\n\n**Testing areas:**\n- Unit testing\n- Integration testing\n- End-to-end testing\n- Test coverage",
    performance:
      "\n\nMy application is experiencing performance issues and I need help identifying and fixing bottlenecks.\n\n**Performance concerns:**\n- Load times\n- Memory usage\n- Bundle size\n- Runtime optimization",
    deployment:
      "\n\nI'm preparing to deploy my application to production and want to follow DevOps best practices.\n\n**Deployment considerations:**\n- CI/CD pipelines\n- Container strategies\n- Monitoring\n- Scalability",
    python:
      "\n\nI'm working on a Python project and need guidance on best practices and efficient patterns.\n\n**Python topics:**\n- Code organization\n- Package management\n- Performance optimization\n- Testing frameworks",
    git: "\n\nI'm working with a team and need to establish proper version control workflows.\n\n**Git workflow needs:**\n- Branching strategies\n- Merge vs rebase\n- Conflict resolution\n- Code review process",
  };

  return (
    descriptions[topic as keyof typeof descriptions] ||
    "\n\nI need help with this topic and would appreciate any guidance from the community.\n\n**Any insights would be helpful:**\n- Best practices\n- Common pitfalls\n- Recommended tools\n- Learning resources"
  );
}

function generateAnswerContent(): string {
  const templates = [
    "Here's a comprehensive solution to your problem:\n\n### Approach 1: Using Modern Best Practices\n\nThe most effective way to handle this is by implementing the following pattern:\n\n```javascript\n// Example implementation\nfunction solutionExample() {\n  // Your code here\n  return result;\n}\n```\n\nThis approach offers several advantages including better performance and maintainability.",

    "I've encountered this issue before and found these strategies helpful:\n\n- **First**: Always start with the fundamentals\n- **Second**: Consider performance implications\n- **Third**: Test your implementation thoroughly\n\nAdditionally, make sure to check the official documentation for the latest updates and best practices.",

    "Great question! This is a common challenge that many developers face. Here's my recommended approach:\n\n### Step-by-step solution:\n\n1. Analyze your current setup\n2. Identify the root cause\n3. Implement the fix incrementally\n4. Test and validate your changes\n\nRemember to consider edge cases and error handling in your implementation.",

    "Based on my experience, here are the key considerations:\n\n> The most important thing is to understand the underlying principles before jumping into implementation.\n\nI recommend starting with a simple proof of concept and then gradually adding complexity as needed. This approach has saved me countless hours of debugging.",

    "This is definitely achievable! Here's what worked for me:\n\n### Quick Solution\n\n```javascript\n// Simple implementation\nconst solution = {\n  method: 'example',\n  params: ['param1', 'param2'],\n  execute: function() {\n    // Implementation details\n  }\n};\n```\n\nFor a more robust solution, consider implementing proper error handling and validation.",
  ];

  return getRandomElement(templates);
}

function generateCommentContent(): string {
  const templates = [
    "Great answer! I'd like to add that you should also consider the security implications of this approach.",
    "This worked perfectly for my use case. Thanks for sharing!",
    "Just a heads up - this solution might not work with the latest version. Here's an updated approach: `updatedMethod()`",
    "I tried this but encountered an issue with browser compatibility. Has anyone else experienced this?",
    "Excellent explanation! For anyone interested, here's a related resource that might be helpful: [link]",
    "One thing to note is that this pattern might not be suitable for large-scale applications due to performance concerns.",
    "I've been using this approach for months and it's been rock solid. Highly recommended!",
    "Could you provide more details about how this handles edge cases?",
    "This is similar to what I implemented, but I added caching for better performance.",
    "Thanks for this! Saved me hours of debugging.",
  ];

  return getRandomElement(templates);
}

// Run the seeder
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Seeding process completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
