import React from "react";

interface ChatHistorySkeletonProps {
  count?: number;
}

const ChatHistorySkeleton = ({
  count = 6,
}: ChatHistorySkeletonProps) => {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 animate-pulse"
        >
          {/* Icon */}
          <div className="h-4 w-4 rounded-md bg-muted shrink-0" />

          {/* Text */}
          <div className="flex-1 space-y-1">
            <div className="h-2.5 w-3/4 rounded bg-muted" />
            <div className="h-2 w-1/2 rounded bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistorySkeleton;