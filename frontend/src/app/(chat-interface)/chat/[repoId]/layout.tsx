"use client";

import ChatSideBar from "@/components/ChatSideBar";
import Nav from "@/components/Nav";
import React, { useState } from "react";

const ChatLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chatSidebarOpen, setChatSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      <ChatSideBar
        isOpen={chatSidebarOpen}
        onClose={() => setChatSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        <Nav
          onMenuClick={() => setChatSidebarOpen(true)}
        />

        <div className="flex-1 w-full min-h-0 relative">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;