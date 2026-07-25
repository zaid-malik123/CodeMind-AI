"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Globe,
  FileCode,
  Layers,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import useDebounce from "@/hooks/useDebounce";
import repoService from "@/services/repo.service";
import RepoSkeletonCard from "@/components/RepoSkeletonCard";
import { IRepository } from "@/types/repo.types";

const Chat = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const debounceSearch = useDebounce(searchQuery);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [repos, setRepos] = useState<IRepository[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await repoService.getRepo(currentPage, 10, debounceSearch);
      
        setRepos(res.data.repos || []);

        // Update totalPages if returned from backend API (adjust according to your API schema)
        if (res.data.pagination.totalPages) {
          setTotalPages(res.data.pagination.totalPages);
        } else if (res.data.pagination.total) {
          setTotalPages(Math.ceil(res.data.pagination.total / 10));
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching repositories:", error.message);
        } else {
          console.error(
            "An unknown error occurred while fetching repositories.",
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [currentPage, debounceSearch]);

  // Pagination Handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleStartChat = (repoId: string) => {
    router.push(`/chat/${repoId}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center p-6 md:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key="selection-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="w-full max-w-5xl"
        >
          {/* Header Section */}
          <div className="mb-12 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              AI Agent Hub
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-4 sm:text-5xl bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              Select a Workspace
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Connect your codebase vectors to the CodeMind LLM copilot cluster
              to initiate secure, context-aware engineering sessions.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-10 max-w-md shadow-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search repository index..."
              value={searchQuery}
              onChange={(e) => {
                (setSearchQuery(e.target.value), setCurrentPage(1));
              }}
              className="w-full rounded-2xl border border-border bg-card/50 pl-11 pr-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Repository Grid / Loading / Empty States */}
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <RepoSkeletonCard key={index} />
              ))}
            </div>
          ) : repos.length > 0 ? (
            <>
              <motion.div layout className="grid gap-4 md:grid-cols-2">
                <AnimatePresence mode="popLayout">
                  {repos.map((repo) => (
                    <motion.div
                      layout
                      key={repo._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                    >
                      <div>
                        {/* Upper Metadata Block */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-card-foreground cursor-pointer hover:text-primary hover:underline transition-colors">
                              {repo.repoName || "Unnamed Repository"}
                            </h2>

                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                                repo.status === "ready"
                                  ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10"
                                  : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                              }`}
                            >
                              {repo.status === "ready" ? (
                                <CheckCircle2 size={10} />
                              ) : (
                                <Loader2 size={10} className="animate-spin" />
                              )}
                              <span className="capitalize">
                                {repo.status || "Processing"}
                              </span>
                            </span>
                          </div>

                          <button
                            type="button"
                            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>

                        {/* Github Link */}
                        <a
                          href={repo.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Globe size={12} />
                          <span className="truncate max-w-[280px] sm:max-w-xs">
                            {repo.githubUrl}
                          </span>
                        </a>
                      </div>

                      {/* Lower Technical Parameters Panel */}
                      <div className="mt-6">
                        <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/40 w-fit">
                          <div className="flex items-center gap-1">
                            <FileCode size={12} className="text-primary" />
                            <span className="font-mono font-medium text-foreground">
                              {repo.totalFiles || 0} Files
                            </span>
                          </div>
                          <div className="flex items-center gap-1 border-l border-border pl-3">
                            <Layers size={12} className="text-sky-500" />
                            <span className="font-mono font-medium text-foreground">
                              {repo.totalChunks || 0} Chunks
                            </span>
                          </div>
                          <div className="flex items-center gap-1 border-l border-border pl-3">
                            <Clock size={12} />
                            <span>
                              {repo.updatedAt
                                ? new Date(repo.updatedAt).toLocaleDateString()
                                : ""}
                            </span>
                          </div>
                        </div>

                        {/* Step Status Indicator Footer */}
                        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-foreground">
                              Current Step:
                            </span>
                            <span className="px-2 py-0.5 rounded bg-muted text-foreground font-mono uppercase text-[10px] tracking-wider">
                              {repo.currentStep || "N/A"}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartChat(repo._id )}
                          className="mt-4 text-sm bg-primary hover:bg-primary/80 text-primary-foreground font-medium rounded-lg px-4 py-2 w-full transition-colors cursor-pointer"
                        >
                          Start AI Chat
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2 border-t border-border/40 pt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    aria-label="Previous Page"
                    className="flex items-center justify-center rounded-xl border border-border p-2.5 text-foreground bg-card shadow-sm hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="text-sm font-medium px-4 text-muted-foreground">
                    Page <span className="text-foreground">{currentPage}</span>{" "}
                    of <span className="text-foreground">{totalPages}</span>
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Next Page"
                    className="flex items-center justify-center rounded-xl border border-border p-2.5 text-foreground bg-card shadow-sm hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            /* EMPTY RESULT SET */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center border border-dashed border-border rounded-3xl p-12 bg-card/20"
            >
              <p className="text-sm text-muted-foreground font-medium">
                No repositories match your search criteria.
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chat;
