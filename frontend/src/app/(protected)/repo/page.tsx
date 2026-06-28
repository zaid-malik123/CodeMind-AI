"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  GitFork, 
  Star, 
  Eye, 
  Filter, 
  Plus, 
  MoreVertical, 
  GitBranch, 
  Clock, 
  Lock, 
  Unlock 
} from "lucide-react";
import { useRouter } from "next/navigation";

// Dummy Repositories Extended Data
const initialRepos = [
  {
    id: 1,
    name: "codemind-ai-frontend",
    description: "Next.js 14 production client integrated with Framer Motion, TailwindCSS, and React Hook Form.",
    isPrivate: false,
    language: "TypeScript",
    langColor: "bg-blue-500",
    stars: 12,
    forks: 2,
    watchers: 5,
    updatedAt: "2 hours ago",
    activeBranch: "main"
  },
  {
    id: 2,
    name: "auth-service-backend",
    description: "High-performance microservice handles stateless JWT session management and OAuth2 providers.",
    isPrivate: true,
    language: "Go",
    langColor: "bg-cyan-500",
    stars: 4,
    forks: 0,
    watchers: 2,
    updatedAt: "Yesterday",
    activeBranch: "dev"
  },
  {
    id: 3,
    name: "analytics-dashboard-v2",
    description: "Data visualization pipeline mapping high-throughput system charts and client telemetries.",
    isPrivate: false,
    language: "JavaScript",
    langColor: "bg-yellow-500",
    stars: 48,
    forks: 14,
    watchers: 9,
    updatedAt: "3 days ago",
    activeBranch: "main"
  },
  {
    id: 4,
    name: "ai-model-inference",
    description: "FastAPI server running optimized weights and contextual parsing for production LLM calls.",
    isPrivate: true,
    language: "Python",
    langColor: "bg-green-500",
    stars: 128,
    forks: 32,
    watchers: 41,
    updatedAt: "1 week ago",
    activeBranch: "prod-release"
  }
];

const Repo = () => {
  const [repos] = useState(initialRepos);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLang, setFilterLang] = useState("All");
  const router = useRouter()

  // Filtering Logic
  const filteredRepos = repos.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          repo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === "All" || repo.language === filterLang;
    return matchesSearch && matchesLang;
  });

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
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-muted-foreground" />
          <select
            value={filterLang}
            onChange={(e) => setFilterLang(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary cursor-pointer"
          >
            <option value="All">All Languages</option>
            <option value="TypeScript">TypeScript</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Go">Go</option>
            <option value="Python">Python</option>
          </select>
        </div>
      </div>

      {/* REPOSITORY CARDS GRID LIST */}
      <motion.div 
        layout
        className="grid gap-4 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {filteredRepos.map((repo) => (
            <motion.div
              layout
              key={repo.id}
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
                      {repo.name}
                    </h2>
                    
                    {/* Status Pill Badge */}
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                      repo.isPrivate 
                        ? "bg-amber-500/5 text-amber-500 border-amber-500/10" 
                        : "bg-blue-500/5 text-blue-500 border-blue-500/10"
                    }`}>
                      {repo.isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                      {repo.isPrivate ? "Private" : "Public"}
                    </span>
                  </div>

                  <button type="button" className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Description */}
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {repo.description}
                </p>
              </div>

              {/* Lower Technical Parameters Panel */}
              <div className="mt-6">
                {/* Branch Context info info */}
                <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-xl border border-border/40 w-fit">
                  <div className="flex items-center gap-1">
                    <GitBranch size={12} className="text-primary" />
                    <span className="font-mono font-medium text-foreground">{repo.activeBranch}</span>
                  </div>
                  <div className="flex items-center gap-1 border-l border-border pl-3">
                    <Clock size={12} />
                    <span>{repo.updatedAt}</span>
                  </div>
                </div>

                {/* Engagement / Language Stats */}
                <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${repo.langColor}`} />
                    <span className="font-medium text-foreground">{repo.language}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors cursor-pointer">
                      <Star size={14} /> {repo.stars}
                    </span>
                    <span className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                      <GitFork size={14} /> {repo.forks}
                    </span>
                    <span className="flex items-center gap-1 sm:flex hidden">
                      <Eye size={14} /> {repo.watchers}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* EMPTY RESULT SET UX STATE */}
      {filteredRepos.length === 0 && (
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