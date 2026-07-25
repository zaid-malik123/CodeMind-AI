import ChatSideBar from "@/components/ChatSideBar";
import Nav from "@/components/Nav";
import React from "react";

const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <ChatSideBar />

      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Nav />

        <div className="flex-1 w-full min-h-0 relative">{children}</div>
      </div>
    </div>
  );
};

export default ChatLayout;
