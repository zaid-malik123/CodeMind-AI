import groq from "../../config/groq.config.js";

export const generateChatTitle = async (question: string) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",

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
