"use client";

import { motion } from "framer-motion";
import {
  Plus,
  GitFork,
  Star,
  Folder,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= ANIMATION VARIANTS ================= */

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
  hidden: {
    opacity: 0,
    y: 15,
  },

  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
    },
  },
};

/* ================= DUMMY DATA ================= */

const dummyRepos = [
  {
    id: 1,
    name: "codemind-ai-frontend",
    status: "Public",
    language: "TypeScript",
    stars: 12,
    updated: "2 hours ago",
  },
  {
    id: 2,
    name: "auth-service-backend",
    status: "Private",
    language: "Go",
    stars: 4,
    updated: "Yesterday",
  },
  {
    id: 3,
    name: "analytics-dashboard-v2",
    status: "Public",
    language: "JavaScript",
    stars: 48,
    updated: "3 days ago",
  },
  {
    id: 4,
    name: "ai-model-inference",
    status: "Private",
    language: "Python",
    stars: 128,
    updated: "1 week ago",
  },
];

const Dashboard = () => {
  const router = useRouter();

  const handleCreateRepo = () => {
    router.push("/repo/create");
  };

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="
        min-h-full
        w-full
        bg-background
        text-foreground
        px-4
        py-5
        sm:px-6
        sm:py-7
        md:px-8
        md:py-10
        lg:px-10
      "
    >
      {/* ================= HEADER ================= */}

      <motion.div
        variants={itemVariants}
        className="
          mb-6
          flex
          flex-col
          gap-5
          sm:mb-10
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        {/* Title */}

        <div className="min-w-0">
          <h1
            className="
              text-2xl
              font-extrabold
              tracking-tight
              sm:text-3xl
              md:text-4xl
            "
          >
            Dashboard
          </h1>

          <p
            className="
              mt-1
              max-w-2xl
              text-xs
              leading-relaxed
              text-muted-foreground
              sm:text-sm
            "
          >
            Welcome back! Here is what's happening with your repositories today.
          </p>
        </div>

        {/* Create Repository */}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateRepo}
          className="
            flex
            w-full
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-primary
            px-5
            py-3
            text-sm
            font-semibold
            text-primary-foreground
            shadow-lg
            shadow-primary/20
            transition-all
            hover:bg-primary/90
            sm:w-auto
          "
        >
          <Plus size={18} />

          <span>Create Repository</span>
        </motion.button>
      </motion.div>

      {/* ================= STATS ================= */}

      <motion.div
        variants={itemVariants}
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          sm:mb-10
          sm:grid-cols-2
          md:gap-5
          lg:grid-cols-3
        "
      >
        {/* Total Repositories */}

        <motion.div
          whileHover={{ y: -4 }}
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            shadow-sm
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Total Repositories
            </span>

            <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
              <Folder size={20} />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-bold">14</h3>

            <p className="mt-1 flex items-center gap-1 text-xs text-green-500">
              <Activity size={12} />
              +2 added this month
            </p>
          </div>
        </motion.div>

        {/* Total Stars */}

        <motion.div
          whileHover={{ y: -4 }}
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            shadow-sm
            sm:p-6
          "
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Total Stars
            </span>

            <div className="shrink-0 rounded-lg bg-yellow-500/10 p-2 text-yellow-500">
              <Star size={20} />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-bold">192</h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Across all workspace projects
            </p>
          </div>
        </motion.div>

        {/* Security Status */}

        <motion.div
          whileHover={{ y: -4 }}
          className="
            rounded-2xl
            border
            border-border
            bg-card
            p-5
            shadow-sm
            sm:col-span-2
            sm:p-6
            lg:col-span-1
          "
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-muted-foreground">
              Security Status
            </span>

            <div className="shrink-0 rounded-lg bg-green-500/10 p-2 text-green-500">
              <ShieldAlert size={20} />
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-3xl font-bold">Secured</h3>

            <p className="mt-1 text-xs text-green-500">
              0 vulnerabilities found
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* ================= RECENT REPOSITORIES ================= */}

      <motion.div
        variants={itemVariants}
        className="
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-card
          shadow-sm
        "
      >
        {/* Section Header */}

        <div
          className="
            border-b
            border-border
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <h2 className="text-base font-bold sm:text-lg">
            Recent Repositories
          </h2>
        </div>

        {/* ================= DESKTOP / TABLET TABLE ================= */}

        <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[700px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="px-6 py-3.5">
                  Repository Name
                </th>

                <th className="px-6 py-3.5">
                  Status
                </th>

                <th className="px-6 py-3.5">
                  Language
                </th>

                <th className="px-6 py-3.5 text-right">
                  Stars
                </th>

                <th className="px-6 py-3.5 text-right">
                  Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border text-sm">
              {dummyRepos.map((repo) => (
                <tr
                  key={repo.id}
                  className="
                    group
                    transition-colors
                    hover:bg-muted/30
                  "
                >
                  <td className="flex items-center gap-2.5 px-6 py-4 font-medium text-card-foreground">
                    <GitFork
                      size={16}
                      className="
                        shrink-0
                        text-muted-foreground
                        transition-colors
                        group-hover:text-primary
                      "
                    />

                    <span
                      className="
                        max-w-[220px]
                        cursor-pointer
                        truncate
                        hover:text-primary
                        hover:underline
                      "
                    >
                      {repo.name}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        repo.status === "Public"
                          ? "border-blue-500/10 bg-blue-500/5 text-blue-500"
                          : "border-amber-500/10 bg-amber-500/5 text-amber-500"
                      }`}
                    >
                      {repo.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-muted-foreground">
                    {repo.language}
                  </td>

                  <td className="px-6 py-4 text-right font-medium">
                    {repo.stars}
                  </td>

                  <td className="whitespace-nowrap px-6 py-4 text-right text-muted-foreground">
                    {repo.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE REPOSITORY CARDS ================= */}

        <div className="divide-y divide-border sm:hidden">
          {dummyRepos.map((repo) => (
            <div
              key={repo.id}
              className="
                p-4
                transition-colors
                hover:bg-muted/30
              "
            >
              {/* Top */}

              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <GitFork
                    size={17}
                    className="shrink-0 text-primary"
                  />

                  <span className="truncate text-sm font-semibold">
                    {repo.name}
                  </span>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
                    repo.status === "Public"
                      ? "border-blue-500/10 bg-blue-500/5 text-blue-500"
                      : "border-amber-500/10 bg-amber-500/5 text-amber-500"
                  }`}
                >
                  {repo.status}
                </span>
              </div>

              {/* Bottom Info */}

              <div
                className="
                  mt-3
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-2
                  text-xs
                  text-muted-foreground
                "
              >
                <span>{repo.language}</span>

                <span className="flex items-center gap-1">
                  <Star size={13} />
                  {repo.stars}
                </span>

                <span>{repo.updated}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.main>
  );
};

export default Dashboard;