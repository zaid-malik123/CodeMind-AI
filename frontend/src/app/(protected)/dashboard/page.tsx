"use client";

import { motion } from "framer-motion";
import { Plus, GitFork, Star, Folder, ShieldAlert, Activity } from "lucide-react";
import { useRouter } from "next/navigation";

// Framer Motion Variants for Staggered Animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

// Dummy Data for Repositories
const dummyRepos = [
  { id: 1, name: "codemind-ai-frontend", status: "Public", language: "TypeScript", stars: 12, updated: "2 hours ago" },
  { id: 2, name: "auth-service-backend", status: "Private", language: "Go", stars: 4, updated: "Yesterday" },
  { id: 3, name: "analytics-dashboard-v2", status: "Public", language: "JavaScript", stars: 48, updated: "3 days ago" },
  { id: 4, name: "ai-model-inference", status: "Private", language: "Python", stars: 128, updated: "1 week ago" },
];

const Dashboard = () => {
  const router = useRouter()
  // Dummy Handler for Create Repo
  const handleCreateRepo = () => {
    router.push("/repo/create")
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="min-h-screen bg-background p-6 text-foreground md:p-10"
    >
      {/* HEADER SECTION */}
      <motion.div 
        variants={itemVariants} 
        className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here is what's happening with your repositories today.
          </p>
        </div>

        {/* Create Repository Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateRepo}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          <Plus size={18} />
          <span>Create Repository</span>
        </motion.button>
      </motion.div>

      {/* STATS OVERVIEW SECTION */}
      <motion.div 
        variants={itemVariants} 
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10"
      >
        {/* Stat Card 1 */}
        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Repositories</span>
            <div className="rounded-lg bg-primary/10 p-2 text-primary"><Folder size={20} /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold">14</h3>
            <p className="mt-1 text-xs text-green-500 flex items-center gap-1">
              <Activity size={12} /> +2 added this month
            </p>
          </div>
        </motion.div>

        {/* Stat Card 2 */}
        <motion.div whileHover={{ y: -4 }} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Stars</span>
            <div className="rounded-lg bg-yellow-500/10 p-2 text-yellow-500"><Star size={20} /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold">192</h3>
            <p className="mt-1 text-xs text-muted-foreground">Across all workspace projects</p>
          </div>
        </motion.div>

        {/* Stat Card 3 */}
        <motion.div whileHover={{ y: -4 }} className="grid-cols-1 sm:col-span-2 lg:col-span-1 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Security Status</span>
            <div className="rounded-lg bg-green-500/10 p-2 text-green-500"><ShieldAlert size={20} /></div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold">Secured</h3>
            <p className="mt-1 text-xs text-green-500">0 vulnerabilities found</p>
          </div>
        </motion.div>
      </motion.div>

      {/* RECENT ACTIVITY / REPOSITORIES LIST */}
      <motion.div 
        variants={itemVariants} 
        className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
      >
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold">Recent Repositories</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5">Repository Name</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Language</th>
                <th className="px-6 py-3.5 text-right">Stars</th>
                <th className="px-6 py-3.5 text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {dummyRepos.map((repo) => (
                <tr 
                  key={repo.id} 
                  className="transition-colors hover:bg-muted/30 group"
                >
                  <td className="px-6 py-4 font-medium text-card-foreground flex items-center gap-2.5">
                    <GitFork size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="cursor-pointer hover:underline hover:text-primary">{repo.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      repo.status === "Public" 
                        ? "bg-blue-500/5 text-blue-500 border-blue-500/10" 
                        : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                    }`}>
                      {repo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{repo.language}</td>
                  <td className="px-6 py-4 text-right font-medium">{repo.stars}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground">{repo.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;