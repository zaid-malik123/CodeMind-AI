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

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.warn(
    "ACCESS_TOKEN_SECRET is not defined in environment variables. Using default value 'default_access_token_secret'.",
  );
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  console.warn(
    "REFRESH_TOKEN_SECRET is not defined in environment variables. Using default value 'default_refresh_token_secret'.",
  );
}

if (!process.env.REDIS_HOST) {
  console.warn(
    "REDIS_HOST is not defined in environment variables. Using default value 'redis://localhost:6379'.",
  );
}

if (!process.env.EMAIL_USER) {
  console.warn(
    "EMAIL_USER is not defined in environment variables. Email functionality may not work properly.",
  );
}

if (!process.env.APP_PASSWORD) {
  console.warn(
    "APP_PASSWORD is not defined in environment variables. Email functionality may not work properly.",
  );
}

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,

  NODE_ENV: process.env.NODE_ENV || "development",

  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",

  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET,

  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET,

  REDIS_HOST: process.env.REDIS_HOST,

  EMAIL_USER: process.env.EMAIL_USER ,
  APP_PASSWORD: process.env.APP_PASSWORD ,
};
