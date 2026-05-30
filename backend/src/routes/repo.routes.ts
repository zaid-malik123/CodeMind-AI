import express from 'express';
import repoController from '../controllers/repo.controller.js';
import { createRepoValidator } from '../validator/repo.validation.js';
import { validateRequest } from "../middlewares/validation.middleware.js";
import authMiddleware from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/create", authMiddleware, createRepoValidator, validateRequest, repoController.createRepo)

export default router;