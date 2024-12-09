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
        className="relative cursor-text rounded-lg bg-gray-50 pb-4 dark:bg-accent"
      >
        <div
          ref={divRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          className="min-h-[56px] resize-none rounded-t-lg bg-transparent px-4 pt-4 text-lg focus:outline-none"
          aria-label="Message input"
        />
        {showPlaceholder && (
          <p className="pointer-events-none absolute left-4 top-4 text-muted-foreground/30">
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
        <div className="flex items-center justify-between px-4">
          <div className="space-x-2">{/* Space for future actions */}</div>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            disabled={isLoading || isEmpty}
            className={cn(
              "rounded-full bg-black p-0 text-white hover:bg-gray-600 hover:text-white",
              "disabled:cursor-not-allowed disabled:opacity-20"
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
