"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // Agar Next.js app router hai
import { 
  MessageSquare, GitFork, Star, Lock, Unlock, Search
} from "lucide-react";

const dummyRepos = [
  { id: "repo-1", name: "codemind-ai-frontend", desc: "Next.js 14 production client architecture integrated with Framer Motion, Tailwind CSS, and strict TypeScript compilation.", isPrivate: false, language: "TypeScript", langColor: "bg-blue-500", stars: 12, forks: 2 },
  { id: "repo-2", name: "auth-service-backend", desc: "High-performance Go microservice handling stateless distributed session management, JWT signing, and secure OAuth2 pipelines.", isPrivate: true, language: "Go", langColor: "bg-cyan-500", stars: 4, forks: 0 },
  { id: "repo-3", name: "analytics-dashboard-v2", desc: "Real-time telemetry and data visualization pipeline mapping high-throughput system charts and transactional websocket data.", isPrivate: false, language: "JavaScript", langColor: "bg-yellow-500", stars: 48, forks: 14 },
];

const Chat = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Search logic filter
  const filteredRepos = dummyRepos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (repoId: string) => {
    // Ab click par modal nahi khulega, sidha alag chat panel page par navigate karega!
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
          {/* Header section with modern letter spacing */}
          <div className="mb-12 text-left">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
              AI Agent Hub
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight mt-4 sm:text-5xl bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              Select a Workspace
            </h1>
            <p className="mt-3 text-base text-muted-foreground max-w-2xl leading-relaxed">
              Connect your codebase vectors to the CodeMind LLM copilot cluster to initiate secure, context-aware engineering sessions.
            </p>
          </div>

          {/* Premium minimal search container */}
          <div className="relative mb-10 max-w-md shadow-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/70" />
            <input
              type="text"
              placeholder="Search repository index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-card/50 pl-11 pr-4 py-3 text-sm text-foreground outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/5 placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Redesigned Premium Cards Grid */}
          <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
            {filteredRepos.map((repo) => (
              <motion.div
                key={repo.id}
                whileHover={{ y: -6, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.08)" }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all hover:border-primary/30"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <h3 className="font-bold text-foreground text-lg tracking-tight truncate max-w-[160px] md:max-w-full">
                      {repo.name}
                    </h3>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold tracking-wide border uppercase shrink-0 ${
                      repo.isPrivate 
                        ? "bg-amber-500/5 text-amber-500 border-amber-500/20" 
                        : "bg-blue-500/5 text-blue-500 border-blue-500/20"
                    }`}>
                      {repo.isPrivate ? <Lock size={10} /> : <Unlock size={10} />}
                      {repo.isPrivate ? "Private" : "Public"}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                    {repo.desc}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs font-medium text-muted-foreground/80 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${repo.langColor}`} />
                      <span>{repo.language}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 hover:text-yellow-500 transition-colors"><Star size={13} /> {repo.stars}</span>
                      <span className="flex items-center gap-1 hover:text-primary transition-colors"><GitFork size={13} /> {repo.forks}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartChat(repo.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/95 active:scale-[0.98]"
                  >
                    <MessageSquare size={15} />
                    <span>Start AI Chat</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Chat;