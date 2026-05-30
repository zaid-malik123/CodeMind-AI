import { config } from "dotenv";
config();

if (!process.env.PORT) {
  console.warn(
    "PORT is not defined in environment variables. Using default value 5000.",
  );
}

if (!process.env.MONGO_URI) {
  console.warn(
    "MONGO_URI is not defined in environment variables. Using default value mongodb://localhost:27017/myapp.",
  );
}

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/myapp",

  NODE_ENV: process.env.NODE_ENV || "development",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret",

  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",


  REDIS_HOST: process.env.REDIS_HOST || "redis://localhost:6379",
};
