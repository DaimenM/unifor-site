"use client";

import { useState, useRef } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/image-gallery";
import ReactMarkdown from "react-markdown";
import { 
  ImageIcon, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  Link as LinkIcon, 
  Eye,
  Edit2
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { editor } from "monaco-editor";

interface MarkdownEditorProps {
  content: string;
  onChange: (value: string) => void;
  images?: string[];
}

export function MarkdownEditor({ content, onChange, images = [] }: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleImageSelect = (imageUrl: string) => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      const text = `![Image](${imageUrl})`;
      
      if (selection) {
        editor.executeEdits('image-insert', [{
          range: selection,
          text,
          forceMoveMarkers: true
        }]);
      }
      editor.focus();
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = prefix, defaultText = "text") => {
    if (editorRef.current) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      
      if (selection) {
        const text = editor.getModel()?.getValueInRange(selection) || defaultText;
        editor.executeEdits('format', [{
          range: selection,
          text: `${prefix}${text}${suffix}`,
          forceMoveMarkers: true
        }]);
      } else {
        const position = editor.getPosition();
        if (position) {
          editor.executeEdits('format', [{
            range: {
              startLineNumber: position.lineNumber,
              startColumn: position.column,
              endLineNumber: position.lineNumber,
              endColumn: position.column
            },
            text: `${prefix}${defaultText}${suffix}`,
            forceMoveMarkers: true
          }]);
        }
      }
      editor.focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("**")}
            title="Bold"
            disabled={isPreview}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("*")}
            title="Italic"
            disabled={isPreview}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("## ", "", "Heading")}
            title="Heading 2"
            disabled={isPreview}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("### ", "", "Heading")}
            title="Heading 3"
            disabled={isPreview}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("- ", "", "List item")}
            title="List"
            disabled={isPreview}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertMarkdown("[", "](url)", "link text")}
            title="Link"
            disabled={isPreview}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {!isPreview && (
            <Sheet>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Images
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Image Gallery</SheetTitle>
                  <SheetDescription>
                    Select an image to insert it into your article
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <ImageGallery images={images} onImageSelect={handleImageSelect} />
                </div>
              </SheetContent>
            </Sheet>
          )}
          {isPreview && (
            <Button type="button" variant="outline" size="sm" disabled>
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              setIsPreview(!isPreview);
            }}
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
      </div>

      <div className="relative min-h-[400px] w-full border rounded-md">
        {isPreview ? (
          <div className="prose prose-sm max-w-none p-4 prose-headings:mt-4 prose-headings:mb-2">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <Editor
            height="400px"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => onChange(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              wordWrap: "on",
              wrappingIndent: "same",
              lineNumbers: "off",
              padding: { top: 16 },
              scrollBeyondLastLine: false,
            }}
          />
        )}
      </div>
    </div>
  );
} 