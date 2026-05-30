import nodemailer from 'nodemailer';
import { env } from "../config/env.js"

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.APP_PASSWORD
  }
});