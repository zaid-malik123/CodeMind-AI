"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FolderPlus, 
  GitBranch, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Play, 
  ArrowRight 
} from "lucide-react";

// User Defined Repo Status Enums
export const REPO_STATUS = {
  REPO_PENDING: "pending",
  REPO_CLONNING: "cloning",
  REPO_SCANNING: "scanning",
  REPO_CHUNKING: "chunking",
  REPO_EMBEDDING: "embedding",
  REPO_READY: "ready",
  REPO_FAILED: "failed",
} as const;

type RepoStatusType = typeof REPO_STATUS[keyof typeof REPO_STATUS];

// Mapping each status to progress percentage and UI text
const statusConfig: Record<RepoStatusType, { percent: number; label: string; description: string }> = {
  [REPO_STATUS.REPO_PENDING]: { percent: 10, label: "Initializing", description: "Preparing secure workspace sandbox..." },
  [REPO_STATUS.REPO_CLONNING]: { percent: 25, label: "Cloning", description: "Fetching repository codebase assets from source host..." },
  [REPO_STATUS.REPO_SCANNING]: { percent: 45, label: "Scanning", description: "Analyzing abstract syntax trees and security architectures..." },
  [REPO_STATUS.REPO_CHUNKING]: { percent: 65, label: "Chunking", description: "Parsing documents into optimized structural semantic segments..." },
  [REPO_STATUS.REPO_EMBEDDING]: { percent: 85, label: "Embedding", description: "Vectorizing code vectors into high-dimensional space vector DB..." },
  [REPO_STATUS.REPO_READY]: { percent: 100, label: "Ready", description: "Workspace successfully optimized and ready for chat queries." },
  [REPO_STATUS.REPO_FAILED]: { percent: 100, label: "Failed", description: "Pipelines crashed. Please check configurations and retry." },
};

const CreateRepo = () => {
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [currentStatus, setCurrentStatus] = useState<RepoStatusType>(REPO_STATUS.REPO_PENDING);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentConfig = statusConfig[currentStatus];

  // Submission Pipeline
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName || !repoUrl) return;
    setIsProcessing(true);
    setCurrentStatus(REPO_STATUS.REPO_PENDING);
  };

  // DEV SIMULATOR: Status Cycle Changer
  const simulateNextStep = () => {
    const statusArray: RepoStatusType[] = [
      REPO_STATUS.REPO_PENDING,
      REPO_STATUS.REPO_CLONNING,
      REPO_STATUS.REPO_SCANNING,
      REPO_STATUS.REPO_CHUNKING,
      REPO_STATUS.REPO_EMBEDDING,
      REPO_STATUS.REPO_READY
    ];
    const currentIndex = statusArray.indexOf(currentStatus);
    if (currentIndex < statusArray.length - 1) {
      setCurrentStatus(statusArray[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 text-foreground md:p-10 flex flex-col items-center justify-center">
      
      {/* DEVELOPMENT CONTROL BOARD (Sirf testing ke liye, badme aap ise remove kar sakte hain) */}
      {isProcessing && (
        <div className="mb-6 flex gap-3 bg-muted/40 p-3 rounded-xl border border-border text-xs max-w-xl w-full justify-between items-center">
          <span className="font-mono text-muted-foreground">Status Simulator Controller:</span>
          <div className="flex gap-2">
            <button 
              type="button"
              onClick={simulateNextStep}
              disabled={currentStatus === REPO_STATUS.REPO_READY}
              className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/20 disabled:opacity-40"
            >
              <Play size={12} /> Next Status
            </button>
            <button 
              type="button"
              onClick={() => setCurrentStatus(REPO_STATUS.REPO_FAILED)}
              className="bg-red-500/10 text-red-500 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-500/20"
            >
              Simulate Failure
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <AnimatePresence mode="wait">
          {!isProcessing ? (
            
            /* STEP 1: INPUT CREDENTIALS FORM */
            <motion.div
              key="form-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <FolderPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">Connect Repository</h2>
                  <p className="text-sm text-muted-foreground">Index your repository contexts into CodeMind AI workspace.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Repository Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., core-analytics-engine"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Git Repository URL</label>
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary transition-colors"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <span>Build Context Engine</span>
                  <ArrowRight size={16} />
                </motion.button>
              </form>
            </motion.div>
          ) : (
            
            /* STEP 2: LIVE METRIC TRACKING PIPELINE */
            <motion.div
              key="progress-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Pipeline Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase">Processing Stack</span>
                  <h3 className="text-lg font-bold mt-0.5">{repoName}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-primary font-mono">{currentConfig.percent}%</span>
                </div>
              </div>

              {/* REAL-TIME FRAMER MOTION PROGRESS BAR */}
              <div className="relative h-2.5 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full transition-colors duration-300 ${
                    currentStatus === REPO_STATUS.REPO_FAILED ? "bg-red-500" : "bg-primary"
                  }`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${currentConfig.percent}%` }}
                  transition={{ type: "spring", damping: 15, stiffness: 80 }}
                />
              </div>

              {/* Current Context Sub-text banner */}
              <div className="rounded-2xl bg-muted/30 border border-border/60 p-4 flex items-start gap-3">
                {currentStatus === REPO_STATUS.REPO_READY ? (
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                ) : currentStatus === REPO_STATUS.REPO_FAILED ? (
                  <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                ) : (
                  <Loader2 size={18} className="text-primary animate-spin shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-sm font-semibold">{currentConfig.label}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{currentConfig.description}</p>
                </div>
              </div>

              {/* STAGE METRIC CHECKLIST PIPELINE */}
              <div className="space-y-2.5 pt-2 border-t border-border/60 text-sm">
                <StatusItem label="Repository Fetch & Verification" isActive={currentStatus !== REPO_STATUS.REPO_PENDING} icon={<GitBranch size={16} />} status={currentStatus} stage="cloning" />
                <StatusItem label="AST Structure & Security Audit" isActive={currentConfig.percent > 25} icon={<Terminal size={16} />} status={currentStatus} stage="scanning" />
                <StatusItem label="Semantic Text Optimization (Chunking)" isActive={currentConfig.percent > 45} icon={<Cpu size={16} />} status={currentStatus} stage="chunking" />
                <StatusItem label="High-Dimensional Embeddings Synthesis" isActive={currentConfig.percent > 65} icon={<CheckCircle2 size={16} />} status={currentStatus} stage="embedding" />
              </div>

              {/* RESET FORM ACTIONS PANEL */}
              {(currentStatus === REPO_STATUS.REPO_READY || currentStatus === REPO_STATUS.REPO_FAILED) && (
                <motion.button
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  type="button"
                  onClick={() => {
                    setIsProcessing(false);
                    setCurrentStatus(REPO_STATUS.REPO_PENDING);
                  }}
                  className={`w-full py-3 rounded-xl font-semibold border text-center text-sm transition-colors ${
                    currentStatus === REPO_STATUS.REPO_READY 
                      ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" 
                      : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                  }`}
                >
                  {currentStatus === REPO_STATUS.REPO_READY ? "Go to Workspace Dashboard" : "Reconfigure Infrastructure Pipeline"}
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Internal Sub-component to track item check-boxes cleanly
const StatusItem = ({ label, isActive, icon, status, stage }: { label: string; isActive: boolean; icon: React.ReactNode; status: RepoStatusType; stage: string }) => {
  const isFailed = status === REPO_STATUS.REPO_FAILED;
  
  return (
    <div className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
      <div className="flex items-center gap-3">
        <div className={`${isActive ? "text-primary" : "text-muted-foreground/40"}`}>{icon}</div>
        <span className={isActive ? "font-medium" : "font-normal"}>{label}</span>
      </div>
      <div>
        {isActive ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : isFailed ? (
          <XCircle size={16} className="text-red-500" />
        ) : (
          <div className="h-4 w-4 rounded-full border border-border border-t-transparent animate-spin" />
        )}
      </div>
    </div>
  );
};

export default CreateRepo;