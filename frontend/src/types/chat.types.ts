
export interface ChatI {
    _id: string;
    userId: string;
    repoId: string;
    title?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessageI {
    _id: string;
    chatId: string;
    role: "user" | "assistant";
    content: string;
    fileRefs?: {
        filePath: string
    }[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateChatResponseI {
  chat: ChatI;
  userMessage: MessageI;
  aiMessage: MessageI;
}