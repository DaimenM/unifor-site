"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Italic,
  List,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Eye,
  Edit2,
} from "lucide-react";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  className?: string;
}

export function MarkdownEditor({
  content,
  onChange,
  className,
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = (
    prefix: string,
    suffix: string = prefix,
    defaultText = "text",
    prefixOnly = false
  ) => {
    const textarea = document.querySelector(
      "textarea"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || defaultText;
    
    // For prefix-only cases (like lists and headings), don't add the suffix
    const newContent = prefixOnly
      ? content.substring(0, start) +
        prefix +
        textToInsert +
        content.substring(end)
      : content.substring(0, start) +
        prefix +
        textToInsert +
        suffix +
        content.substring(end);

    onChange(newContent);

    // Set cursor position and select the default text if it was inserted
    setTimeout(() => {
      textarea.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + textToInsert.length;
      
      if (!selectedText && textToInsert === defaultText) {
        // If we inserted the default text, select it
        textarea.setSelectionRange(newStart, newEnd);
      } else {
        // Otherwise, place cursor at the end
        textarea.setSelectionRange(newEnd, newEnd);
      }
    }, 0);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("**")}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("*")}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("## ", "", "Heading", true)}
            title="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("### ", "", "Heading", true)}
            title="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("- ", "", "List item", true)}
            title="List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("[", "](url)", "link text")}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("![", "](url)", "alt text")}
            title="Image"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsPreview(!isPreview)}
          className="ml-auto"
        >
          {isPreview ? (
            <>
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" /> Preview
            </>
          )}
        </Button>
      </div>

      {isPreview ? (
        <div className="prose max-w-none min-h-[200px] p-4 border rounded-md bg-background">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[200px] font-mono"
          placeholder="Write your article content here..."
        />
      )}
    </div>
  );
} 