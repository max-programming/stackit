"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionEditor } from "~/components/question/question-editor";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { createQuestion } from "~/lib/actions/questions";

export default function AskQuestionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title.trim()) {
        setError("Title is required");
        return;
      }

      if (!formData.description.trim()) {
        setError("Description is required");
        return;
      }

      // Process tags
      const tagList = formData.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create question
      const result = await createQuestion({
        title: formData.title.trim(),
        description: formData.description.trim(),
        tags: tagList,
      });

      if (result.success && result.slug) {
        // Redirect to the created question
        router.push(`/questions/${result.slug}`);
      } else {
        setError(result.error || "Failed to create question");
      }
    } catch (err) {
      console.error("Error creating question:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">Ask a Question</h1>
          <p className="text-muted-foreground text-lg">
            Share your programming question with the community and get help from
            other developers.
          </p>
        </div>

        <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-xl">Create Your Question</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-medium">{error}</p>
                </div>
              )}

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-lg font-semibold mb-2"
                >
                  Title
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Be specific and imagine you're asking a question to another
                  person.
                </p>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                  placeholder="e.g., How do I implement authentication in Next.js?"
                  disabled={isSubmitting}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-lg font-semibold mb-2"
                >
                  Description
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Provide details about your problem. Include what you've tried
                  and what specific help you need.
                </p>
                <QuestionEditor
                  value={formData.description}
                  onChange={value =>
                    setFormData({ ...formData, description: value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-lg font-semibold mb-2"
                >
                  Tags
                </label>
                <p className="text-sm text-muted-foreground mb-3">
                  Add up to 5 tags to describe what your question is about.
                  Separate tags with commas.
                </p>
                <input
                  id="tags"
                  type="text"
                  value={formData.tags}
                  onChange={e =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-base"
                  placeholder="e.g., nextjs, react, authentication, javascript"
                  disabled={isSubmitting}
                />
                {formData.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags
                      .split(",")
                      .map(tag => tag.trim())
                      .filter(tag => tag.length > 0)
                      .slice(0, 5)
                      .map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !formData.title.trim() ||
                    !formData.description.trim()
                  }
                  className="px-8"
                >
                  {isSubmitting ? "Creating..." : "Post Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
