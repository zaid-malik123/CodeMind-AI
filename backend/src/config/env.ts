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

if(!process.env.RABBITMQ_URL) {
  console.warn(
    "RABBITMQ_URL is not defined in environment variables. Using default value 'amqp://guest:guest@localhost:5672'.",
  );
}

if(!process.env.CLOUDINARY_CLOUD_NAME) {
  console.warn(
    "CLOUDINARY_CLOUD_NAME is not defined in environment variables.",
  );
}

if(!process.env.CLOUDINARY_API_KEY) {
  console.warn(
    "CLOUDINARY_API_KEY is not defined in environment variables.",
  );
}

if(!process.env.CLOUDINARY_API_SECRET) {
  console.warn(
    "CLOUDINARY_API_SECRET is not defined in environment variables.",
  );
}

if(!process.env.AI_API_KEY) {
  console.warn(
    "AI_API_KEY is not defined in environment variables. AI functionality may not work properly.",
  );
}

if(!process.env.VECTOR_DB_API_KEY) {
  console.warn(
    "VECTOR_DB_API_KEY is not defined in environment variables. Vector database functionality may not work properly.",
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

  REDIS_HOST: process.env.REDIS_HOST || "redis://localhost:6379",

  EMAIL_USER: process.env.EMAIL_USER ,
  APP_PASSWORD: process.env.APP_PASSWORD ,
  RABBIT_URL: process.env.RABBIT_URL,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  AI_API_KEY: process.env.AI_API_KEY,
  VECTOR_DB_API_KEY: process.env.VECTOR_DB_API_KEY,
};
  