"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  FolderGit2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { useTheme } from "@/hooks/useTheme";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Repositories",
    href: "/repo",
    icon: FolderGit2,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const { theme } = useTheme();
  

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-border bg-background fixed top-0 left-0">
      {/* Logo */}
      <div className="flex items-center px-6 py-4">
        <Image
          src={`${theme === "dark" ? "/darkLogo1.png" : "/lightLogo.png"}`}
          alt="CodeMind AI"
          width={180}
          height={60}
          className="h-15 w-auto object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {links.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
              ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Card */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
            {user?.name.charAt(0)}
          </div>

          <div className="overflow-hidden">
            <p className="truncate font-medium text-foreground">{user?.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              CodeMind AI
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
