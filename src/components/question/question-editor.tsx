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
import { Markdown } from "~/components/ui/markdown";

interface QuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

type TextAlignment = "left" | "center" | "right";

export function QuestionEditor({
  value,
  onChange,
  placeholder = "Describe your question in detail... You can use markdown formatting.",
  disabled = false,
}: QuestionEditorProps) {
  const [textAlignment, setTextAlignment] = useState<TextAlignment>("left");

  const handleFormat = (format: string) => {
    const textarea = document.getElementById(
      "question-description"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

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
      case "align-left":
      case "align-center":
      case "align-right":
        const alignment = format.replace("align-", "") as TextAlignment;
        setTextAlignment(alignment);
        return;
      default:
        return;
    }

    const newContent =
      value.substring(0, start) + formattedText + value.substring(end);
    onChange(newContent);

    // Set cursor position after the formatted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("bold")}
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("italic")}
          className="h-8 w-8 p-0"
          disabled={disabled}
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
          disabled={disabled}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("numbered")}
          className="h-8 w-8 p-0"
          disabled={disabled}
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
          disabled={disabled}
        >
          <Link className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-border" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("align-left")}
          className={`h-8 w-8 p-0 ${
            textAlignment === "left" ? "bg-muted" : ""
          }`}
          disabled={disabled}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("align-center")}
          className={`h-8 w-8 p-0 ${
            textAlignment === "center" ? "bg-muted" : ""
          }`}
          disabled={disabled}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => handleFormat("align-right")}
          className={`h-8 w-8 p-0 ${
            textAlignment === "right" ? "bg-muted" : ""
          }`}
          disabled={disabled}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Textarea */}
      <textarea
        id="question-description"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full min-h-[300px] p-4 bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm leading-relaxed text-${textAlignment}`}
        disabled={disabled}
      />

      {/* Preview */}
      {value && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <h4 className="text-sm font-medium text-foreground mb-2">Preview:</h4>
          <div className={`text-muted-foreground text-${textAlignment}`}>
            <Markdown content={value} className="prose-sm" />
          </div>
        </div>
      )}
    </div>
  );
}
