import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '~/lib/utils';

interface MarkdownMessageProps {
  content: string;
  isUser?: boolean;
  className?: string;
}

export function MarkdownMessage({ content, isUser, className }: MarkdownMessageProps) {
  return (
    <div
      className={cn(
        "p-4 rounded-lg max-w-[80%]",
        isUser 
          ? "bg-blue-500 text-white ml-auto" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {isUser ? (
        <p className="whitespace-pre-wrap">{content}</p>
      ) : (
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert max-w-none"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            pre: ({ node, ...props }) => (
              <div className="relative group">
                <pre {...props} className="overflow-x-auto p-4 rounded bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100" />
              </div>
            ),
            code: ({ node, inline, ...props }: { node?: any; inline?: boolean }) =>
              inline ? (
                <code {...props} className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-1 py-0.5 rounded" />
              ) : (
                <code {...props} className="text-gray-900 dark:text-gray-100" />
              ),
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 last:mb-0">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 last:mb-0">{children}</ol>,
            li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
            a: ({ children, href }) => (
              <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      )}
    </div>
  );
}
