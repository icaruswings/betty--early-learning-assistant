import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { cn } from "~/lib/utils";

type Props = {
  isLoading?: boolean;
  onSubmit: (value: string) => void;
  placeholder?: string;
};

export default function ChatInput({
  onSubmit,
  isLoading = false,
  placeholder = "Type your message here.",
}: Props) {
  const [content, setContent] = useState("");
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const divRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const focusInput = useCallback(() => {
    if (divRef.current) {
      divRef.current.focus();
      // Move cursor to end of content
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(divRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(content);
    setContent("");
    setShowPlaceholder(true);

    if (divRef.current) {
      divRef.current.innerText = "";
    }
  };

  const handleInput = () => {
    if (divRef.current && textareaRef.current) {
      const newContent = divRef.current.innerText;
      setContent(newContent);
      setShowPlaceholder(!newContent.trim());
      textareaRef.current.value = newContent;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Check for Command + Return (Mac) or Control + Return (Windows)
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const isEmpty = !content.trim();

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="w-full">
      <div
        ref={containerRef}
        onClick={focusInput}
        className="bg-gray-50 dark:bg-accent rounded-lg pb-4 cursor-text relative"
      >
        <div
          ref={divRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="bg-transparent resize-none focus:outline-none text-lg rounded-t-lg px-4 pt-4 min-h-[56px]"
          aria-label="Message input"
        />
        {showPlaceholder && (
          <p className="absolute top-4 left-4 text-gray-400 dark: text-accent-foreground pointer-events-none">
            {placeholder}
          </p>
        )}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
        />
        <div className="flex justify-between items-center px-4">
          <div className="space-x-2">{/* Space for future actions */}</div>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isLoading || isEmpty}
            className={cn(
              "rounded-full bg-black hover:bg-gray-600 text-white hover:text-white p-0",
              "disabled:opacity-20 disabled:cursor-not-allowed"
            )}
          >
            <ArrowUp className="h-6 w-6" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
