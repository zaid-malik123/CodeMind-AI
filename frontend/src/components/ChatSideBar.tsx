"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MessageSquare, Plus, ArrowLeft, Terminal, 
  LogOut, Loader2 
} from "lucide-react";
import chatService from "@/services/chat.service";

// Interface Definitions
interface ChatItem {
  _id: string;
  userId: string;
  repoId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ChatSideBar = () => {
  const router = useRouter();
  const params = useParams();
  
  // Params se current route states
  const activeRepoId = params?.id?.toString() || "codemind-ai";
  
  // State management
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Scroll reference for Infinite Scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Chats Function with Pagination Support
  const fetchChats = useCallback(async (pageNum: number) => {
    if (!activeRepoId || isLoading) return;

    setIsLoading(true);
    try {
      // Assuming chatService accepts (repoId, page, limit)
      const response = await chatService.getAllChats(activeRepoId, pageNum, 30);
      const newDocs: ChatItem[] = response.data.docs || [];
      const pagination: PaginationData = response.data.pagination;

      setChatHistory((prev) => 
        pageNum === 1 ? newDocs : [...prev, ...newDocs]
      );

      // Check if more pages exist
      if (pageNum >= pagination.totalPages || newDocs.length === 0) {
        setHasMore(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching chat history:", error.message);
      } else {
        console.error("Error fetching chat history:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [activeRepoId]);

  // Initial Fetch on Repo Change
  useEffect(() => {
    setChatHistory([]);
    setPage(1);
    setHasMore(true);
    fetchChats(1);
  }, [activeRepoId]);

  // Scroll Event Listener for Infinite Scroll
  const handleScroll = () => {
    if (!scrollContainerRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Bottom border se 20px pahle trigger hoga
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchChats(nextPage);
        return nextPage;
      });
    }
  };

  return (
    <aside className="w-[270px] h-screen bg-card/60 backdrop-blur-xl text-foreground flex flex-col justify-between border-r border-border/50 select-none shrink-0 font-sans transition-colors duration-200">
      
      {/* 1. TOP SECTION: HEADER & ACTIONS */}
      <div className="p-3.5 space-y-3">
        {/* Exit Button */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Exit to Dashboard</span>
        </button>

        {/* Start New Session Trigger */}
        <button
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-95 active:scale-[0.98] transition-all text-xs font-bold shadow-md shadow-primary/10"
        >
          <div className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2.5} />
            <span>New Session</span>
          </div>
          <kbd className="text-[10px] bg-primary-foreground/15 px-1.5 py-0.5 rounded font-mono hidden sm:inline-block">⌘N</kbd>
        </button>

        {/* Workspace Scope Indicator */}
        <div className="pt-2">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase px-1">Context Scope</p>
          <div className="mt-1.5 flex items-center gap-2.5 bg-muted/40 p-2.5 rounded-xl border border-border/40 text-foreground cursor-default group hover:border-primary/30 transition-colors">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Terminal size={13} />
            </div>
            <span className="truncate font-mono font-bold text-xs text-foreground/80 group-hover:text-primary transition-colors">
              {activeRepoId}
            </span>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: INFINITE SCROLL CHAT HISTORY */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 custom-scrollbar"
      >
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground/60 px-2 mb-2 uppercase">
          Recent Conversations
        </p>

        {/* Dynamic Chat Items */}
        {chatHistory.map((chat) => {
          const isActive = chat._id === params?.id;
          return (
            <button
              key={chat._id}
              type="button"
              onClick={() => router.push(`/chat/${chat._id}`)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs transition-all duration-200 relative group ${
                isActive 
                  ? "bg-primary/10 text-primary font-bold shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MessageSquare size={14} className={`shrink-0 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-muted-foreground"}`} />
              <span className="truncate flex-1">{chat.title}</span>
              
              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}

        {/* Skeleton Loaders (Pagination Loader State) */}
        {isLoading && (
          <div className="space-y-1.5 pt-1">
            {[...Array(3)].map((_, i) => (
              <div 
                key={`skel-${i}`} 
                className="w-full h-9 rounded-xl bg-muted/40 animate-pulse flex items-center gap-3 px-3"
              >
                <div className="w-3.5 h-3.5 rounded bg-muted-foreground/20 shrink-0" />
                <div className="h-2.5 rounded bg-muted-foreground/20 flex-1" />
              </div>
            ))}
          </div>
        )}

        {/* No Chats Empty State */}
        {!isLoading && chatHistory.length === 0 && (
          <div className="text-center py-8 px-2">
            <p className="text-xs text-muted-foreground font-medium">No chats found in this context.</p>
          </div>
        )}
      </div>

      {/* 3. BOTTOM SECTION: USER PROFILE */}
      <div className="p-3 border-t border-border/50 bg-muted/10">
        <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-violet-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md shadow-primary/20">
              ZM
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">Zaid Malik</span>
              <span className="text-[10px] text-muted-foreground/80 font-medium truncate">Premium Cluster</span>
            </div>
          </div>
          <button 
            type="button"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Modern Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.15);
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(150, 150, 150, 0.3);
        }
      `}</style>
    </aside>
  );
};

export default ChatSideBar;