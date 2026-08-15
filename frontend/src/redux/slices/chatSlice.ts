import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatState = {
  chatId: string | null;
  messages: Message[];
  loading: boolean;
};

const initialState: ChatState = {
  chatId: null,
  messages: [],
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    clearChat: (state) => {
      state.chatId = null;
      state.messages = [];
      state.loading = false;
    },
  },
});

export const {
  setChatId,
  addMessage,
  setMessages,
  setLoading,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;