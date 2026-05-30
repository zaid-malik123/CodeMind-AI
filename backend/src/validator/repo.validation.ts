import { body } from "express-validator";

export const createRepoValidator = [
  body("githubUrl")
    .notEmpty()
    .withMessage("GitHub URL is required")
    .isURL()
    .withMessage("Invalid GitHub URL")
    .matches(/^https:\/\/github\.com\/.+\/.+$/)
    .withMessage("GitHub URL must be in the format https://github.com/username/repository"),

  body("repoName")
    .optional()
    .isString()
    .withMessage("Repository name must be a string")
    .isLength({ min: 1 })
    .withMessage("Repository name cannot be empty"),
];