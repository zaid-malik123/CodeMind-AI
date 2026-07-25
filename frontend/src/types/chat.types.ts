
export interface ChatI {
    _id: string;
    userId: string;
    repoId: string;
    title?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface MessageI {
    chatId: string;
    role: "user" | "assistant";
    content: string;
    fileRefs?: {
        filePath: string
    }[];
    createdAt?: string;
    updatedAt?: string;
}