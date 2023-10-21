import express from "express";
import * as questionController from "../controllers/question";

export const ROUTE_QUESTIONS = '/api/questions';

export const router = express.Router();

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestion);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);
