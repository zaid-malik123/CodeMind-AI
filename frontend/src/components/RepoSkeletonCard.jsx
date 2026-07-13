"use client"
const RepoSkeletonCard = () => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm animate-pulse">
      <div>
        {/* Upper Metadata Block Skeleton */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Repo Name Title Bar */}
            <div className="h-6 bg-muted rounded-lg w-1/3" />
            
            {/* Status Pill Badge */}
            <div className="h-5 bg-muted rounded-full w-20" />
          </div>

          {/* More Action Button */}
          <div className="h-8 w-8 bg-muted rounded-lg" />
        </div>

        {/* Github URL Link Skeleton */}
        <div className="mt-3 h-4 bg-muted rounded-md w-1/2" />
      </div>

      {/* Lower Technical Parameters Panel */}
      <div className="mt-8">
        {/* Metrics Context Info Info Wrapper */}
        <div className="mb-4 flex flex-wrap items-center gap-3 bg-muted/20 px-3 py-2 rounded-xl border border-border/40 w-fit">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-20 border-l border-border pl-3" />
          <div className="h-4 bg-muted rounded w-24 border-l border-border pl-3" />
        </div>

        {/* Step Status Indicator Footer */}
        <div className="border-t border-border/60 pt-4 flex items-center gap-2">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-5 bg-muted rounded w-14" />
        </div>
      </div>
    </div>
  );
};

export default RepoSkeletonCard;