import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import remarkGfm from "remark-gfm";

const components: Components = {
  a({ href, children }) {
    if (!href) return <>{children}</>;
    if (href.startsWith("/")) {
      return <Link to={href}>{children}</Link>;
    }
    return (
      <a href={href} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  },
};

export function DocMarkdown({ source }: { source: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {source}
    </ReactMarkdown>
  );
}
