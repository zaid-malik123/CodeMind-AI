"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  GitFork, 
  Star, 
  Eye, 
  Plus, 
  MoreVertical, 
  GitBranch, 
  Clock, 
  Globe, 
  FileCode, 
  Layers, 
  CheckCircle2, 
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import repoService from "@/services/repo.service";

const Repo = () => {
  const [repos, setRepos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const search = useDebounce(searchQuery);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Total pages track karne ke liye state
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const limit = 10; // Per page items limit

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const res = await repoService.getRepo(page, limit, search);
      
        if (res?.data) {
          setRepos(res.data.repos || []);
          setTotalPages(res.data.pagination.totalPages || 1);
        } else {
          setRepos(res || []);
        }
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [search, page]);

  // Page change handlers
  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground md:p-10">
      
      {/* HEADER SECTION */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Repositories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your codebase workspaces, active synchronization branches, and production metrics.
          </p>
        </div>

        <motion.button
          onClick={() => router.push("/repo/create")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          <Plus size={18} />
          <span>New Repository</span>
        </motion.button>
      </div>

      {/* FILTER & SEARCH CONTROL CONTROLLER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search repositories..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1); // Nayi search par page reset karein 1 par
            }}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* REPOSITORY CARDS GRID LIST */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-2">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-sm font-medium">Loading repositories...</p>
        </div>
      ) : repos.length > 0 ? (
        <>
          <motion.div layout className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {repos.map((repo) => (
                <motion.div
                  layout
                  key={repo._id || repo.id}
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
                        
                        {/* Status Pill Badge based on API response status */}
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                          repo.status === "ready" 
                            ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" 
                            : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                        }`}>
                          {repo.status === "ready" ? <CheckCircle2 size={10} /> : <Loader2 size={10} className="animate-spin" />}
                          <span className="capitalize">{repo.status || "Processing"}</span>
                        </span>
                      </div>

                      <button type="button" className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                        <MoreVertical size={16} />
                      </button>
                    </div>

                    {/* Github URL Link */}
                    <a 
                      href={repo.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe size={12} />
                      <span className="truncate max-w-[280px] sm:max-w-xs">{repo.githubUrl}</span>
                    </a>
                  </div>

                  {/* Lower Technical Parameters Panel */}
                  <div className="mt-6">
                    {/* Metrics Context Info Info */}
                    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/40 w-fit">
                      <div className="flex items-center gap-1">
                        <FileCode size={12} className="text-primary" />
                        <span className="font-mono font-medium text-foreground">{repo.totalFiles || 0} Files</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-border pl-3">
                        <Layers size={12} className="text-sky-500" />
                        <span className="font-mono font-medium text-foreground">{repo.totalChunks || 0} Chunks</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-border pl-3">
                        <Clock size={12} />
                        <span>{repo.updatedAt ? new Date(repo.updatedAt).toLocaleDateString() : ""}</span>
                      </div>
                    </div>

                    {/* Step Status Indicator Footer */}
                    <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-foreground">Current Step:</span>
                        <span className="px-2 py-0.5 rounded bg-muted text-foreground font-mono uppercase text-[10px] tracking-wider">
                          {repo.currentStep || "N/A"}
                        </span>
                      </div>
                    </div>
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
                disabled={page === 1}
                className="flex items-center justify-center rounded-xl border border-border p-2.5 text-foreground bg-card shadow-sm hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="text-sm font-medium px-4 text-muted-foreground">
                Page <span className="text-foreground">{page}</span> of <span className="text-foreground">{totalPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="flex items-center justify-center rounded-xl border border-border p-2.5 text-foreground bg-card shadow-sm hover:bg-muted disabled:opacity-40 disabled:hover:bg-card transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        /* EMPTY RESULT SET UX STATE */
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center border border-dashed border-border rounded-3xl p-12 bg-card/20"
        >
          <p className="text-sm text-muted-foreground font-medium">No repositories match your search criteria.</p>
        </motion.div>
      )}
      
    </div>
  );
};

export default Repo;