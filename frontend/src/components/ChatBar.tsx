"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  User,
  Sparkles,
  Code2,
  Terminal,
  Flame,
  ShieldCheck,
  ArrowUp,
  Loader2,
} from "lucide-react";
import chatService from "@/services/chat.service";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { addChat, setActiveChat } from "@/redux/slices/chatSlice";
import { MessageI } from "@/types/chat.types";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { socket } from "@/lib/socket";

type props = {
  repoId: string;
  chatId?: string;
};

const ChatBar = ({ repoId, chatId }: props) => {
  const [messages, setMessages] = useState<MessageI[]>([]);
  const [input, setInput] = useState("");
  const [streamingAiContent, setStreamingAiContent] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingAiContent]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const res = await chatService.getSingleChatMessages(chatId);
          setMessages(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) return;

    socket.emit("chat-room", chatId);

    socket.on("ai-response", (data: { token?: string }) => {
      if (data?.token) {
        setStreamingAiContent((prev) => prev + data.token);
      }
    });

    return () => {
      socket.off("ai-response");
    };
  }, [chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const question = input.trim();
    setInput("");
    setIsSending(true);

    const tempUserMsg: MessageI = {
      _id: Date.now().toString(),
      chatId: chatId ?? "",
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await chatService.createNewChatTitle({
        repoId,
        question,
        chatId: chatId ?? "",
      });

      const { chat, aiMessage } = res.data;

      if (!chatId) {
        dispatch(addChat(chat));
        dispatch(setActiveChat(chat._id));
        router.push(`/chat/${repoId}/${chat._id}`);
      } else {
        setMessages((prev) => [...prev, aiMessage]);
        setStreamingAiContent("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full bg-background text-foreground flex flex-col justify-between absolute inset-0">
      {/* 1. TOP DYNAMIC AREA */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full custom-scrollbar">
        {!chatId ? (
          /* EMBEDDED LANDING VIEW */
          <div className="h-full flex flex-col items-center justify-center px-4 max-w-2xl mx-auto w-full select-none pb-12">
            <div className="mb-6 p-4 rounded-3xl bg-primary/10 text-primary border border-primary/20">
              <Sparkles size={36} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-center bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground bg-clip-text text-transparent">
              Where should we begin?
            </h2>
            <p className="text-xs text-muted-foreground/80 text-center mt-2 mb-8 max-w-md">
              Query your loaded codebase vectors directly. CodeMind LLM pipeline is locked onto your active index branches.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                { label: "Trace context loops", icon: <Code2 size={14} /> },
                {
                  label: "Find React optimization hooks",
                  icon: <Terminal size={14} />,
                },
                { label: "Debug memory leaks", icon: <Flame size={14} /> },
                {
                  label: "Audit routing pipeline safety",
                  icon: <ShieldCheck size={14} />,
                },
              ].map((card, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInput(card.label)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl border border-border bg-card hover:bg-muted text-left text-xs text-muted-foreground hover:text-foreground transition-all active:scale-[0.99]"
                >
                  <div className="text-primary/70">{card.icon}</div>
                  <span className="truncate font-medium">{card.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* MODERN CHAT MESSAGES STREAM */
          <div className="px-4 py-8 space-y-6 max-w-4xl w-full mx-auto">
            {messages.map((msg) => {
              const isAI = msg.role === "assistant";
              return (
                <div
                  key={msg._id}
                  className={`flex gap-3 items-start ${
                    isAI ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* AVATAR */}
                  <div
                    className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                      isAI
                        ? "bg-primary/10 border-primary/20 text-primary"
                        : "bg-primary text-primary-foreground border-transparent"
                    }`}
                  >
                    {isAI ? <Bot size={15} /> : <User size={15} />}
                  </div>

                  {/* MESSAGE CONTENT WRAPPER */}
                  <div
                    className={`flex flex-col space-y-1 max-w-[80%] ${
                      isAI ? "items-start" : "items-end"
                    }`}
                  >
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase px-1">
                      {isAI ? "CodeMind Copilot" : "You"}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isAI
                          ? "bg-card border border-border/70 text-foreground rounded-tl-sm w-full shadow-sm"
                          : "bg-primary text-primary-foreground rounded-tr-sm font-medium shadow-md shadow-primary/5"
                      }`}
                    >
                      {isAI ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* LIVE STREAMING AI RESPONSE ITEM */}
            {isSending && (
              <div className="flex gap-3 items-start">
                <div className="h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 text-xs font-bold bg-primary/10 border-primary/20 text-primary shadow-sm">
                  <Bot size={15} />
                </div>
                <div className="flex flex-col space-y-1 max-w-[80%] items-start">
                  <div className="text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase px-1">
                    CodeMind Copilot
                  </div>
                  <div className="bg-card border border-border/70 text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed w-full shadow-sm">
                    {streamingAiContent ? (
                      <MarkdownRenderer content={streamingAiContent} />
                    ) : (
                      <div className="flex items-center gap-1.5 py-1 text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 2. BOTTOM FIXED INPUT PANEL */}
      <div className="p-4 bg-background border-t border-border/40 shrink-0">
        <div className="max-w-3xl w-full mx-auto">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-end rounded-2xl border border-border bg-card px-4 py-3 shadow-lg transition-all duration-200 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything regarding architecture configurations..."
              rows={1}
              disabled={isSending}
              className="flex-1 bg-transparent pr-12 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground/50 resize-none max-h-40 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />

            <button
              type="submit"
              disabled={!input.trim() || isSending}
              className="absolute right-3 bottom-3 h-8 w-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground/40 hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              {isSending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ArrowUp size={15} strokeWidth={2.5} />
              )}
            </button>
          </form>

          <p className="text-[10px] text-center text-muted-foreground/60 mt-2 font-medium tracking-wide">
            CodeMind AI engine handles inference mapping. Verify system dependencies manually.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBar;