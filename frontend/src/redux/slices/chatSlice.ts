// chatSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatI } from "@/types/chat.types";

type ChatState = {
  chatHistory: ChatI[];
  activeChatId: string | null;
};

const initialState: ChatState = {
  chatHistory: [],
  activeChatId: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatHistory: (state, action: PayloadAction<ChatI[]>) => {
      state.chatHistory = action.payload;
    },

    appendChatHistory: (state, action) => {
      const existingIds = new Set(state.chatHistory.map((chat) => chat._id));

      const newChats = action.payload.filter(
        (chat) => !existingIds.has(chat._id),
      );

      state.chatHistory.push(...newChats);
    },

    addChat: (state, action) => {
      const exists = state.chatHistory.some(
        (chat) => chat._id === action.payload._id,
      );

      if (!exists) {
        state.chatHistory.unshift(action.payload);
      }
    },
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChatId = action.payload;
    },
    clearChatHistory: (state) => {
      state.chatHistory = [];
      state.activeChatId = null;
    },
  },
});

export const {
  setChatHistory,
  appendChatHistory,
  addChat,
  setActiveChat,
  clearChatHistory,
} = chatSlice.actions;

export default chatSlice.reducer;
