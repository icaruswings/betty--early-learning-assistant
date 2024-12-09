import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "~/lib/utils";

interface MarkdownMessageProps {
  content: string;
  isUserMessage?: boolean;
  className?: string;
}

const COMPONENTS: Partial<Components> = {
  pre: ({ node, ...props }) => (
    <div className="group relative">
      <pre
        {...props}
        className="overflow-x-auto rounded bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100"
      />
    </div>
  ),
  code: ({ node, inline, ...props }: { node?: any; inline?: boolean }) =>
    inline ? (
      <code
        {...props}
        className="rounded bg-gray-100 px-1 py-0.5 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
      />
    ) : (
      <code {...props} className="text-gray-900 dark:text-gray-100" />
    ),
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-4 list-disc pl-6 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 last:mb-0">{children}</ol>,
  li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-blue-600 hover:underline dark:text-blue-400"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

export function MarkdownMessage({ content, isUserMessage, className }: MarkdownMessageProps) {
  return (
    <div
      className={cn(
        "px-8 py-4",
        isUserMessage
          ? "ml-auto max-w-[80%] rounded-3xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          : "",
        className
      )}
    >
      {isUserMessage ? (
        <p className="whitespace-pre-wrap">{content}</p>
      ) : (
        <ReactMarkdown
          className="prose prose-sm max-w-none dark:prose-invert"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={COMPONENTS}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
