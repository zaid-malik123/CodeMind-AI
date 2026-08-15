"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, Plus, ArrowLeft, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  appendChatHistory,
  clearChatHistory,
  setActiveChat,
} from "@/redux/slices/chatSlice";
import chatService from "@/services/chat.service";
import ChatHistorySkeleton from "./ChatHistorySkeleton";

const ChatSideBar = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();

  const chatHistory = useSelector((state: RootState) => state.chat.chatHistory);

  const activeRepoId = params.repoId?.toString();
  const activeChatId = params.chatId;

  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setIsLoading(true);

        if (!activeRepoId) return;

        const res = await chatService.getAllChats(activeRepoId, page, 20);
        const pagination = res.data.pagination;

        dispatch(appendChatHistory(res.data.docs));

        if (pagination) {
          setHasMore(pagination.totalPages > page);
        } else {
          setHasMore(false);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error fetching chat history:", error.message);
        } else {
          console.error(
            "An unknown error occurred while fetching chat history.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [activeRepoId, page, dispatch]);

  const handleScroll = () => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const bottomReached = scrollTop + clientHeight >= scrollHeight - 20;

    if (bottomReached && hasMore && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (activeRepoId) {
      dispatch(clearChatHistory());
      setPage(1);
      setHasMore(true);
    }
  }, [activeRepoId, dispatch]);

  return (
    <aside className="w-[270px] h-screen bg-card/60 backdrop-blur-xl text-foreground flex flex-col justify-between border-r border-border/50 select-none shrink-0 font-sans transition-colors duration-200">
      <div className="p-3.5 space-y-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-150 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-1 transition-transform duration-200"
          />
          <span>Exit to Dashboard</span>
        </button>

        <button
          onClick={() => {
            dispatch(setActiveChat(null));
            router.push(`/chat/${activeRepoId}`);
          }}
          type="button"
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-95 active:scale-[0.98] transition-all text-xs font-bold shadow-md shadow-primary/10"
        >
          <div className="flex items-center gap-2">
            <Plus size={15} strokeWidth={2.5} />
            <span>New Session</span>
          </div>
          <kbd className="text-[10px] bg-primary-foreground/15 px-1.5 py-0.5 rounded font-mono hidden sm:inline-block">
            ⌘N
          </kbd>
        </button>
      </div>

      <div
        onScroll={handleScroll}
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1 hide-scrollbar"
      >
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground/60 px-2 mb-2 uppercase">
          Recent Conversations
        </p>

        {chatHistory?.map((chat) => {
          const isActive = chat._id === activeChatId;
          return (
            <button
              key={chat._id}
              type="button"
              onClick={() => router.push(`/chat/${activeRepoId}/${chat._id}`)}
              className={`w-full flex items-center gap-2.5 px-3 py-4 rounded-xl text-left text-xs transition-all duration-200 relative group ${
                isActive
                  ? "bg-primary/10 text-primary font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <MessageSquare
                size={14}
                className={`shrink-0 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground/60 group-hover:text-muted-foreground"
                }`}
              />
              <span className="truncate flex-1">{chat.title}</span>

              {isActive && (
                <span className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}

        {isLoading && <ChatHistorySkeleton count={6} />}

        {!isLoading && chatHistory?.length === 0 && (
          <div className="text-center py-8 px-2">
            <p className="text-xs text-muted-foreground font-medium">
              No chats found in this context.
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-border/50 bg-muted/10">
        <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-muted/40 transition-colors">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary via-indigo-500 to-violet-500 flex items-center justify-center text-xs font-black text-white shrink-0 shadow-md shadow-primary/20">
              ZM
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-foreground truncate">
                Zaid Malik
              </span>
              <span className="text-[10px] text-muted-foreground/80 font-medium truncate">
                Premium Cluster
              </span>
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
    </aside>
  );
};

export default ChatSideBar;
