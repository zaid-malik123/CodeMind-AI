import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { ChatI } from "@/types/chat.types";


class ChatService {

    createNewChatTitle = async (payload: { question: string, repoId: string, chatId: string }): Promise<ApiResponse<ChatI>> => {
        const res = await api.post<ApiResponse<ChatI>>("/chat/new", payload);
        return res.data;
    }

    getAllChats = async (repoId: string, page: number = 1, limit: number = 20) => {
        const res = await api.get(`/chat/${repoId}`, {
            params: {
                page,
                limit
            }
        });
        return res.data;
    }

    getSingleChatMessages = async (chatId: string) => {
        const res = await api.get(`/chat/${chatId}/messages`);
        return res.data;
    }
}

export default new ChatService();