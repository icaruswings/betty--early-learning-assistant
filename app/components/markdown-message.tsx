import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { cn } from "~/lib/utils";

interface MarkdownMessageProps {
  /** The markdown content to render */
  content: string;
  /** Whether this is a user message (different styling) */
  isUserMessage?: boolean;
  /** Additional CSS classes to apply */
  className?: string;
  /** Whether this is a streaming message (different styling) */
  isStreaming?: boolean;
}

// Style constants
const STYLES = {
  container: {
    base: "",
    user: "ml-auto max-w-[80%] rounded-2xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  },
  // code: {
  //   inline: "rounded bg-gray-100 px-1 py-0.5 text-gray-900 dark:bg-gray-800 dark:text-gray-100",
  //   block: "text-gray-900 dark:text-gray-100",
  //   pre: "overflow-x-auto rounded bg-gray-100 p-4 text-gray-900 dark:bg-gray-900 dark:text-gray-100",
  // },
  // list: {
  //   wrapper: "mb-4 last:mb-0",
  //   item: "mb-1 last:mb-0",
  // },
  // link: "text-blue-600 hover:underline dark:text-blue-400",
} as const;

const MarkdownComponents: Partial<Components> = {
  //   pre: ({ node, ...props }) => (
  //     <div className="group relative">
  //       <pre {...props} className={STYLES.code.pre} />
  //     </div>
  //   ),
  //   code: ({ node, inline, ...props }: { node?: any; inline?: boolean }) => (
  //     <code {...props} className={inline ? STYLES.code.inline : STYLES.code.block} />
  //   ),
  //   p: ({ children }) => <p className={cn("mb-4 last:mb-0")}>{children}</p>,
  //   ul: ({ children }) => <ul className={cn(STYLES.list.wrapper, "list-disc pl-6")}>{children}</ul>,
  //   ol: ({ children }) => (
  //     <ol className={cn(STYLES.list.wrapper, "list-decimal pl-6")}>{children}</ol>
  //   ),
  //   li: ({ children }) => <li className={STYLES.list.item}>{children}</li>,
  //   a: ({ children, href }) => (
  //     <a href={href} className={STYLES.link} target="_blank" rel="noopener noreferrer">
  //       {children}
  //     </a>
  //   ),
};

export function MarkdownMessage({ content, isStreaming, className }: MarkdownMessageProps) {
  return (
    <ReactMarkdown
      className={cn("prose-md prose max-w-none dark:prose-invert")}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={MarkdownComponents}
    >
      {content}
    </ReactMarkdown>
  );
}
