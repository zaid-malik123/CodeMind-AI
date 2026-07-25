import { api } from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { ChatI } from "@/types/chat.types";


class ChatService {

    createNewChatTitle = async (payload: { title: string, repoId: string }): Promise<ApiResponse<ChatI>> => {
        const res = await api.post<ApiResponse<ChatI>>("/chat/new", payload);
        return res.data;
    }

    getAllChats = async (repoId: string, page: number, limit: number = 30) => {
        const res = await api.get(`/chat/${repoId}`, { params: { page, limit } });
        return res.data;
    }
}

export default new ChatService();