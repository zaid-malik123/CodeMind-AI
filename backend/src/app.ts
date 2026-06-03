import express from "express"
import cors from "cors"
import { errorMiddleware } from "./middlewares/error.middleware.js"
import { env } from "./config/env.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// routes import
import userRoutes from "./routes/user.routes.js";
import repoRoutes from "./routes/repo.routes.js";
import chatRoutes from "./routes/chat.routes.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.CORS_ORIGIN
}));
app.use(morgan("dev"));
app.use(cookieParser());


// routes
app.use("/api/user", userRoutes)
app.use("/api/repo", repoRoutes)
app.use("/api/chat", chatRoutes)



app.use(errorMiddleware);


export default app;