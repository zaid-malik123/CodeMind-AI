"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          const codeString = String(children).replace(/\n$/, "");

          return !inline && match ? (
            <div
              className="relative my-4 rounded-xl overflow-hidden border shadow-sm"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#f8fafc",
                borderColor: isDark ? "#333333" : "#e2e8f0",
              }}
            >
              {/* CODE BLOCK HEADER */}
              <div
                className="flex items-center justify-between px-4 py-2 border-b text-[11px] font-mono"
                style={{
                  backgroundColor: isDark ? "#252526" : "#f1f5f9",
                  borderColor: isDark ? "#333333" : "#e2e8f0",
                  color: isDark ? "#a1a1aa" : "#475569",
                }}
              >
                <span className="font-semibold">{match[1]}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(codeString)}
                  className="flex items-center gap-1.5 transition-colors hover:opacity-80"
                  style={{
                    color: isDark ? "#a1a1aa" : "#475569",
                  }}
                >
                  {copiedCode === codeString ? (
                    <>
                      <Check className="text-emerald-500" size={12} />
                      <span className="text-emerald-500 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              {/* CODE HIGHLIGHTER */}
              <SyntaxHighlighter
                style={isDark ? vscDarkPlus : oneLight}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: "1.25rem",
                  fontSize: "0.85rem",
                  lineHeight: "1.6",
                  background: isDark ? "#1e1e1e" : "#f8fafc",
                }}
                {...props}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          ) : (
            /* INLINE CODE TAGS */
            <code
              className="px-1.5 py-0.5 rounded-md font-mono text-xs font-semibold border"
              style={{
                backgroundColor: isDark ? "#27272a" : "#e2e8f0",
                color: isDark ? "#e4e4e7" : "#334155",
                borderColor: isDark ? "#3f3f46" : "#cbd5e1",
              }}
              {...props}
            >
              {children}
            </code>
          );
        },
        p({ children }) {
          return (
            <p
              className="mb-3 leading-relaxed text-sm font-normal"
              style={{
                color: isDark ? "#f4f4f5" : "#1e293b",
              }}
            >
              {children}
            </p>
          );
        },
        ul({ children }) {
          return (
            <ul
              className="list-disc pl-5 mb-3 space-y-1 text-sm"
              style={{
                color: isDark ? "#f4f4f5" : "#1e293b",
              }}
            >
              {children}
            </ul>
          );
        },
        ol({ children }) {
          return (
            <ol
              className="list-decimal pl-5 mb-3 space-y-1 text-sm"
              style={{
                color: isDark ? "#f4f4f5" : "#1e293b",
              }}
            >
              {children}
            </ol>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
};