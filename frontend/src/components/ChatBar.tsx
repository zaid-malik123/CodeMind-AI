"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, User, Sparkles, Code2, Terminal, Flame, ShieldCheck, ArrowUp
} from "lucide-react";

const ChatBar = () => {
  const [messages, setMessages] = useState<any[]>([]); 
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = input;
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `I've successfully received your initial query: "${currentQuery}". My underlying inference cluster is analyzing your workspace directory hooks.`,
        },
      ]);
    }, 800);
  };

  const isChatEmpty = messages.length === 0;

  return (
    /* h-full ko relative aur flex flex-col denge taaki iske bacche screen height se bade na ho ske */
    <div className="w-full h-full bg-background text-foreground flex flex-col justify-between absolute inset-0">
      
      {/* 1. TOP DYNAMIC AREA (FLEX-1 MATLAB YE MAIN BODY KA SPACE LEGA) */}
      <div className="flex-1 overflow-y-auto min-h-0 w-full custom-scrollbar">
        {isChatEmpty ? (
          /* EMBEDDED LANDING VIEW (Centered Perfectly) */
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

            {/* Prompt Cards */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                { label: "Trace context loops", icon: <Code2 size={14} /> },
                { label: "Find React optimization hooks", icon: <Terminal size={14} /> },
                { label: "Debug memory leaks", icon: <Flame size={14} /> },
                { label: "Audit routing pipeline safety", icon: <ShieldCheck size={14} /> },
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
          /* CONVERSATION STREAM OVERFLOWS HERE */
          <div className="px-4 py-8 space-y-6 max-w-3xl w-full mx-auto">
            {messages.map((msg) => {
              const isAI = msg.role === "assistant";
              return (
                <div key={msg.id} className="flex gap-4 items-start">
                  <div className={`h-8 w-8 rounded-xl border flex items-center justify-center shrink-0 text-xs font-bold ${
                    isAI ? "bg-primary/10 border-primary/20 text-primary" : "bg-muted border-border text-foreground"
                  }`}>
                    {isAI ? <Bot size={15} /> : <User size={15} />}
                  </div>
                  <div className="flex-1 pt-0.5 space-y-1">
                    <div className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{isAI ? "CodeMind Copilot" : "You"}</div>
                    <div className="text-sm leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 2. BOTTOM FIXED INPUT SYSTEM PANEL (STICKY TO THE ABSOLUTE WINDOW BOTTOM) */}
      <div className="p-4 bg-background border-t border-border/40 shrink-0">
        <div className="max-w-3xl w-full mx-auto relative">
          <form 
            onSubmit={handleSendMessage} 
            className="relative rounded-2xl border border-border bg-card px-4 py-3 shadow-xl focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/5 transition-all"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything regarding architecture configurations..."
              rows={1}
              className="w-full bg-transparent pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 resize-none max-h-40 overflow-y-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="absolute right-3 bottom-2.5 p-2 rounded-xl bg-foreground text-background dark:bg-white dark:text-black disabled:bg-muted disabled:text-muted-foreground/40 transition-all shadow-sm"
            >
              <ArrowUp size={14} strokeWidth={2.5} />
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