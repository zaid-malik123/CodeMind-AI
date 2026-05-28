import express from "express"
import cors from "cors"
import { errorMiddleware } from "./middlewares/error.middleware.js"
import { env } from "./config/env.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: env.CORS_ORIGIN
}));
app.use(morgan("dev"));
app.use(cookieParser());


app.use(errorMiddleware);


export default app;