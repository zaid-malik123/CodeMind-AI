"use client";

import { socket } from "@/lib/socket";
import { useState } from "react";

export const useRepoStatus = () => {
  const [status, setStatus] = useState<string | null>("");

  const connect = (repoId: string, onStatus?: (status: string) => void) => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit("join-room", repoId);
    socket.off("repo-status");
    socket.on("repo-status", (data) => {
        setStatus(data.status)
        onStatus?.(data.status)
    })
  };

  return {
    status,
    connect,
  };
};
