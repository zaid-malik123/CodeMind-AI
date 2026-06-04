import { body } from "express-validator";

export const createChatValidator = [
    body("repoId")
        .notEmpty()
        .withMessage("Repository ID is required")
        .isString()
        .withMessage("Repository ID must be a string"),

    body("question")
        .notEmpty()
        .withMessage("Question is required")
        .isString()
        .withMessage("Question must be a string"),

    body("chatId")
        .optional()
        .isString()
        .withMessage("Chat ID must be a string"),
];