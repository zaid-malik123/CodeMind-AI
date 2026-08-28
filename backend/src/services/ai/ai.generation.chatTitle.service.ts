import groq from "../../config/groq.config.js";
import { env } from "../../config/env.js";

export const generateChatTitle = async (question: string) => {
  const completion = await groq.chat.completions.create({
    model: env.GROQ_MODEL_NAME!,

    temperature: 0.1,

    messages: [
      {
        role: "system",
        content: `
Generate a short chat title.

Rules:
- Maximum 6 words.
- Do not use quotes.
- Return title only.
`,
      },
      {
        role: "user",
        content: question,
      },
    ],
  });

  return completion.choices[0]?.message?.content ?? "New Chat";
};
