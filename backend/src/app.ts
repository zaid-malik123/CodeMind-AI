import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { env } from "./config/env.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// routes import
import userRoutes from "./routes/user.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { globalRateLimit } from "./middlewares/rateLimit.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "1mb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  }),
);

app.use(cookieParser());

app.use(morgan("dev"));

app.use(globalRateLimit);

app.get("/health", (req, res) => {
  return res.status(200).json({
    message: "woking .... 👍"
  })
})

// routes
app.use("/api/user", userRoutes);
app.use("/api/repo", repoRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorMiddleware);

export default app;
