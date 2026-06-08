import { env } from "../config/env.js";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
} as const;

export const PINECONE_INDEX_NAME = "code-mind-ai" as const;

export const COOKIE_EXPIRATION = {
  ACCESS_TOKEN: 1000 * 60 * 15, // 15 minutes
  REFRESH_TOKEN: 1000 * 60 * 60 * 24 * 7, // 7 days
} as const;

export const TOKEN_EXPIRATION = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "7d",
} as const;

export const AUTH_COOKIES = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

export const RABBIT_QUEUES = {
  EMAIL_QUEUE: "email_queue",
  REPOSITORY_QUEUE: "repository_queue",
  REPOSITORY_RETRY_QUEUE: "retry_queue",
  REPOSITORY_DLQ: "dead_letter_queue",
} as const;

export const SOCKER_EMMIT = {
  REPO_EMMIT: "repo-status",
  SOCKET_ROOM_ID: "join-room",
  SOCKET_CHAT_ROOM_ID: "chat-room",
  ASK_QUESETION: "ask-question",
  AI_RESPONSE: "ai-response"
};

export const REPO_STATUS = {
  REPO_PENDING: "pending",
  REPO_CLONNING: "cloning",
  REPO_SCANNING: "scanning",
  REPO_CHUNKING: "chunking",
  REPO_EMBEDDING: "embedding",
  REPO_READY: "ready",
  REPO_FAILED: "failed",
} as const;

export const MESSAGES = {
  USER_CREATED: "User created successfully",
  LOGIN_SUCCESS: "Login successful",
  USER_ALREADY_EXIST: "User already exist",
  USER_DOES_NOT_EXIST: "User does not exist please register",
  USER_FETCHED: "User fetched successfully",
  LOGOUT_SUCCESS: "Logout successful",
  MESSAGE_OTP_SENT: "OTP sent to email successfully",
  INVALID_OTP: "Invalid OTP",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
  TOKEN_REFRESHED: "Access token refreshed successfully",
  INVALID_CREDENTIALS: "Invalid credentials",
  UNAUTHORIZED: "Unauthorized access",
  SERVER_ERROR: "Internal server error",
  PROFILE_UPDATED: "Profile updated successfully",
  REPO_NOT_FOUND: "Repository not found",
  REPO_CREATED: "Repo created Successfully",
  REPO_FETCHED: "Repos fetched successfully",
  REPO_STATUS: "Repo status fetched successfully",
  REPO_DELETED: "Repo deleted successfully",
  CHAT_CREATED: "Chat created successfully",
  CHAT_NOT_FOUND: "Chat not found",
  CHAT_FETCHED: "Chat fetched successfully",
  CHAT_DELETED: "Chat deleted successfully",
  EMBEDDING_GENERATION_FAILED: "Failed to generate embedding",
  CHAT_MESSAGES_FETCHED: "Chat messages fetched successfully",
  SOCKET_AUTHENTICATION_FAILED: "socket authentication failed"
  
} as const;
