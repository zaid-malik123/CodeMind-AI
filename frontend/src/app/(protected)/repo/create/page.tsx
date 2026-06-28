"use client";

import React, { useEffect, useState } from "react";
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
  ArrowRight,
  Shield,
  Zap,
  Database,
  HelpCircle,
} from "lucide-react";
import repoService from "@/services/repo.service";
import { useRepoStatus } from "@/hooks/useRepoStatus";
import { useRouter } from "next/navigation";

export const REPO_STATUS = {
  REPO_PENDING: "pending",
  REPO_CLONNING: "cloning",
  REPO_SCANNING: "scanning",
  REPO_CHUNKING: "chunking",
  REPO_EMBEDDING: "embedding",
  REPO_READY: "ready",
  REPO_FAILED: "failed",
} as const;

type RepoStatusType = (typeof REPO_STATUS)[keyof typeof REPO_STATUS];

const statusConfig: Record<
  RepoStatusType,
  { percent: number; label: string; description: string }
> = {
  [REPO_STATUS.REPO_PENDING]: {
    percent: 10,
    label: "Initializing",
    description: "Preparing secure workspace sandbox...",
  },
  [REPO_STATUS.REPO_CLONNING]: {
    percent: 25,
    label: "Cloning",
    description: "Fetching repository codebase assets from source host...",
  },
  [REPO_STATUS.REPO_SCANNING]: {
    percent: 45,
    label: "Scanning",
    description:
      "Analyzing abstract syntax trees and security architectures...",
  },
  [REPO_STATUS.REPO_CHUNKING]: {
    percent: 65,
    label: "Chunking",
    description:
      "Parsing documents into optimized structural semantic segments...",
  },
  [REPO_STATUS.REPO_EMBEDDING]: {
    percent: 85,
    label: "Embedding",
    description:
      "Vectorizing code vectors into high-dimensional space vector DB...",
  },
  [REPO_STATUS.REPO_READY]: {
    percent: 100,
    label: "Ready",
    description: "Workspace successfully optimized and ready for chat queries.",
  },
  [REPO_STATUS.REPO_FAILED]: {
    percent: 100,
    label: "Failed",
    description: "Pipelines crashed. Please check configurations and retry.",
  },
};

const CreateRepo = () => {
  const [repoName, setRepoName] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoId, setRepoId] = useState("")
  const [currentStatus, setCurrentStatus] = useState<RepoStatusType>(
    REPO_STATUS.REPO_PENDING,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const { connect, status } = useRepoStatus();
  const router = useRouter()

  const currentConfig = statusConfig[currentStatus];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoName || !repoUrl) return;

    const res = await repoService.createRepo({
      repoName,
      githubUrl: repoUrl,
    });

    connect(res.data._id);
    setRepoId(res.data._id)

    setIsProcessing(true);
    setCurrentStatus(REPO_STATUS.REPO_PENDING);
  };

  useEffect(() => {
    if (status) {
      setCurrentStatus(status);
    }
  }, [status]);

  const simulateNextStep = () => {
    const statusArray: RepoStatusType[] = [
      REPO_STATUS.REPO_PENDING,
      REPO_STATUS.REPO_CLONNING,
      REPO_STATUS.REPO_SCANNING,
      REPO_STATUS.REPO_CHUNKING,
      REPO_STATUS.REPO_EMBEDDING,
      REPO_STATUS.REPO_READY,
    ];
    const currentIndex = statusArray.indexOf(currentStatus);
    if (currentIndex < statusArray.length - 1) {
      setCurrentStatus(statusArray[currentIndex + 1]);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background p-6 lg:p-10 text-foreground flex flex-col items-center">
      {/* DEV SIMULATOR CONTROLLER */}
      {isProcessing && (
        <div className="mb-6 flex gap-3 bg-primary/5 p-3 rounded-xl border border-primary/20 text-xs max-w-5xl w-full justify-between items-center backdrop-blur-sm animate-pulse">
          <span className="font-mono text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
            Dev Simulator Control Board:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={simulateNextStep}
              disabled={currentStatus === REPO_STATUS.REPO_READY}
              className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-40 transition-all"
            >
              <Play size={12} /> Next Status
            </button>
            <button
              type="button"
              onClick={() => setCurrentStatus(REPO_STATUS.REPO_FAILED)}
              className="bg-destructive/10 text-destructive px-3 py-1.5 rounded-lg font-medium hover:bg-destructive/20 transition-all"
            >
              Simulate Failure
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER: Full Width Responsive Grid Layout */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
        {/* LEFT COLUMN: Main Form & Process Pipeline Card */}
        <div className="lg:col-span-7 bg-card border border-border/60 rounded-2xl p-6 md:p-8 shadow-xl shadow-muted/20">
          <AnimatePresence mode="wait">
            {!isProcessing ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary ring-4 ring-primary/5">
                    <FolderPlus size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      Connect Repository
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Index your codebase contexts into CodeMind AI workspace.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Repository Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., core-analytics-engine"
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                      Git Repository URL
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/repo"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    type="submit"
                    className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                  >
                    <span>Build Context Engine</span>
                    <ArrowRight size={16} />
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="progress-step"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Pipeline Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-primary font-bold uppercase bg-primary/10 px-2.5 py-1 rounded-full">
                      Pipeline Active
                    </span>
                    <h3 className="text-lg font-bold mt-2.5 text-ellipsis overflow-hidden max-w-xs">
                      {repoName}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-primary font-mono">
                      {currentConfig.percent}%
                    </span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      currentStatus === REPO_STATUS.REPO_FAILED
                        ? "bg-destructive"
                        : "bg-primary"
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: `${currentConfig.percent}%` }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  />
                </div>

                {/* Current Banner Status */}
                <div className="rounded-xl bg-muted/40 border border-border/60 p-4 flex items-start gap-3.5">
                  {currentStatus === REPO_STATUS.REPO_READY ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-500 shrink-0 mt-0.5"
                    />
                  ) : currentStatus === REPO_STATUS.REPO_FAILED ? (
                    <XCircle
                      size={20}
                      className="text-destructive shrink-0 mt-0.5"
                    />
                  ) : (
                    <Loader2
                      size={20}
                      className="text-primary animate-spin shrink-0 mt-0.5"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold">
                      {currentConfig.label}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {currentConfig.description}
                    </p>
                  </div>
                </div>

                {/* STAGE METRIC PIPELINE */}
                <div className="space-y-1 pt-3 border-t border-border/60 text-sm">
                  <StatusItem
                    label="Repository Fetch & Verification"
                    isActive={currentStatus !== REPO_STATUS.REPO_PENDING}
                    icon={<GitBranch size={16} />}
                    status={currentStatus}
                  />
                  <StatusItem
                    label="AST Structure & Security Audit"
                    isActive={currentConfig.percent > 25}
                    icon={<Terminal size={16} />}
                    status={currentStatus}
                  />
                  <StatusItem
                    label="Semantic Text Optimization (Chunking)"
                    isActive={currentConfig.percent > 45}
                    icon={<Cpu size={16} />}
                    status={currentStatus}
                  />
                  <StatusItem
                    label="High-Dimensional Embeddings Synthesis"
                    isActive={currentConfig.percent > 65}
                    icon={<Database size={16} />}
                    status={currentStatus}
                  />
                </div>

                {/* ACTION BUTTONS */}
                {(currentStatus === REPO_STATUS.REPO_READY ||
                  currentStatus === REPO_STATUS.REPO_FAILED) && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row gap-3 mt-2 w-full"
                  >
                    {/* Agar repo ready hai, to "Go to Chat Workspace" button pehle dikhega */}
                    {currentStatus === REPO_STATUS.REPO_READY && (
                      <motion.button
                        
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          router.push(`/chat/${repoId}`)
                        }}
                        className="flex-1 py-3.5 rounded-xl font-semibold bg-primary text-primary-foreground text-center text-sm transition-all shadow-lg shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2"
                      >
                        <span>Open Chat Workspace</span>
                        <ArrowRight size={16} />
                      </motion.button>
                    )}

                    {/* Reconfigure ya Reset Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsProcessing(false);
                        setCurrentStatus(REPO_STATUS.REPO_PENDING);
                      }}
                      className={`py-3.5 rounded-xl font-semibold border text-center text-sm transition-all shadow-sm ${
                        currentStatus === REPO_STATUS.REPO_READY
                          ? "px-5 bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          : "w-full bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20"
                      }`}
                    >
                      {currentStatus === REPO_STATUS.REPO_READY
                        ? "Reconfigure"
                        : "Reconfigure Infrastructure Pipeline"}
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Contextual Sidebar Guide */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-muted/30 border border-border/40 rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
              <HelpCircle size={14} className="text-primary" /> How Context
              Processing Works
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-background border border-border/60 flex items-center justify-center shrink-0 text-primary shadow-sm">
                  <Zap size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    1. Vector Embeddings Generation
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Aapka poora code intelligent semantic chunks mein break hota
                    hai taaki CodeMind AI aapke functions ka context samajh
                    sake.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="h-7 w-7 rounded-lg bg-background border border-border/60 flex items-center justify-center shrink-0 text-primary shadow-sm">
                  <Shield size={14} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">
                    2. Secure Localized Parsing
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Repository vectors safe isolated vector engine storage space
                    mein securely store kiye jaate hain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground/60 px-2 text-center lg:text-left">
            Need help configuring custom enterprise repositories?{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Read our integration guidelines
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({
  label,
  isActive,
  icon,
  status,
}: {
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
  status: RepoStatusType;
}) => {
  const isFailed = status === REPO_STATUS.REPO_FAILED;

  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${isActive ? "bg-muted/30 text-foreground" : "text-muted-foreground/50"}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`${isActive ? "text-primary" : "text-muted-foreground/30"}`}
        >
          {icon}
        </div>
        <span
          className={`text-xs truncate ${isActive ? "font-medium" : "font-normal"}`}
        >
          {label}
        </span>
      </div>
      <div className="shrink-0 ml-2">
        {isActive ? (
          <CheckCircle2 size={16} className="text-emerald-500" />
        ) : isFailed ? (
          <XCircle size={16} className="text-destructive" />
        ) : (
          <div className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin" />
        )}
      </div>
    </div>
  );
};

export default CreateRepo;
