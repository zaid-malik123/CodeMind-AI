"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MessageSquare, Plus, ArrowLeft, Terminal, 
  Settings, HelpCircle, LogOut, Sparkles
} from "lucide-react";

const mockChatHistory = [
  { id: "chat-1", title: "Fixing React Hook Form state cycles", timeGroup: "Today" },
  { id: "chat-2", title: "Optimizing Vector query pipeline metrics", timeGroup: "Today" },
  { id: "chat-3", title: "GitHub Actions CI/CD Pipeline fix", timeGroup: "Yesterday" },
  { id: "chat-4", title: "AuthModal Forgot Password logic workflow", timeGroup: "Previous 7 Days" },
];

const ChatSideBar = () => {
  const router = useRouter();
  const params = useParams();
  
  const activeRepoId = params?.id || "codemind-ai-frontend"; 
  const currentChatId = "chat-1"; // Active chat tracking state

  // Unique groups extraction
  const groups = Array.from(new Set(mockChatHistory.map(item => item.timeGroup)));

  return (
    <aside className="w-[260px] h-screen bg-card text-foreground flex flex-col justify-between border-r border-border select-none shrink-0 font-sans transition-colors duration-200">
      
      {/* 1. TOP BLOCK: BRANDING & PRIMARY ACTIONS */}
      <div className="p-3.5 space-y-3">
        {/* Minimal Return Action */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Exit to Dashboard</span>
        </button>

        {/* Start New Session Trigger */}
        <button
          type="button"
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all text-xs font-bold shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Plus size={14} strokeWidth={2.5} />
            <span>New Session</span>
          </div>
          <kbd className="text-[10px] opacity-60 bg-primary-foreground/10 px-1.5 py-0.5 rounded font-mono hidden sm:block">⌘N</kbd>
        </button>

        {/* Workspace Indicator Scope */}
        <div className="pt-2 px-1">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">Context Target</p>
          <div className="mt-2 flex items-center gap-2.5 bg-muted/40 p-2.5 rounded-xl border border-border/60 text-foreground cursor-default group hover:bg-muted/70 transition-colors">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
              <Terminal size={12} />
            </div>
            <span className="truncate font-mono font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors">
              {activeRepoId}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE BLOCK: TIME-GROUPED CHAT HISTORY STREAM */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-5 custom-scrollbar">
        {groups.map((groupName) => (
          <div key={groupName} className="space-y-1">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground/60 px-3 mb-2">
              {groupName}
            </p>
            
            <div className="space-y-0.5">
              {mockChatHistory
                .filter(item => item.timeGroup === groupName)
                .map((chat) => {
                  const isActive = chat.id === currentChatId;
                  return (
                    <button
                      key={chat.id}
                      type="button"
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all relative group ${
                        isActive 
                          ? "bg-muted font-semibold text-foreground shadow-sm" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                    >
                      <MessageSquare size={13.5} className={isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-muted-foreground"} />
                      <span className="truncate pr-1 flex-1">{chat.title}</span>
                      
                      {/* Active Status Ribbon Glow */}
                      {isActive && (
                        <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-primary rounded-r-md" />
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. BOTTOM BLOCK: PROFILE & APP OPTIONS */}
      <div className="p-3.5 border-t border-border bg-muted/20 space-y-1">
       
        {/* Clean Profile Action Element */}
        <div className="pt-2.5 mt-2 flex items-center justify-between border-t border-border px-1">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-violet-500 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm">
              ZM
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate leading-none mb-1">Zaid Malik</span>
              <span className="text-[10px] text-muted-foreground/80 font-medium truncate leading-none">Premium Cluster</span>
            </div>
          </div>
          <button 
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Log Out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* Theme Responsive Smooth Scrollbar Injection */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border, rgba(0, 0, 0, 0.1));
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

    </aside>
  );
};

export default ChatSideBar;