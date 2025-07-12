"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
} from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface AnswerFormProps {
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  title?: string;
}

export function AnswerForm({
  onSubmit,
  isSubmitting = false,
  placeholder = "Write your answer here... You can use markdown formatting.",
  title = "Your Answer",
}: AnswerFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const handleFormat = (format: string) => {
    const textarea = document.getElementById(
      "answer-content"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "bullet":
        formattedText = `• ${selectedText}`;
        break;
      case "numbered":
        formattedText = `1. ${selectedText}`;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        break;
      case "image":
        formattedText = `![${selectedText}](image-url)`;
        break;
      default:
        return;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  // Convert markdown to HTML for preview
  const convertMarkdownToHtml = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
      )
      .replace(
        /!\[([^\]]+)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />'
      )
      .replace(/^•\s+(.*)$/gm, "<li>$1</li>")
      .replace(/^\d+\.\s+(.*)$/gm, "<li>$1</li>")
      .replace(/\n/g, "<br>");
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("bold")}
              className="h-8 w-8 p-0"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("italic")}
              className="h-8 w-8 p-0"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("bullet")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("numbered")}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("link")}
              className="h-8 w-8 p-0"
            >
              <Link className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleFormat("image")}
              className="h-8 w-8 p-0"
              aria-label="Add image"
              role="button"
            >
              {/* <Image className="w-4 h-4"  /> */}
            </Button>
            <div className="w-px h-6 bg-border" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <AlignLeft className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <AlignCenter className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <AlignRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Textarea */}
          <textarea
            id="answer-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[200px] p-4 bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm leading-relaxed"
            disabled={isSubmitting}
          />

          {/* Preview */}
          {content && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Preview:
              </h4>
              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: convertMarkdownToHtml(content),
                }}
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6"
            >
              {isSubmitting ? "Posting..." : "Post Answer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
