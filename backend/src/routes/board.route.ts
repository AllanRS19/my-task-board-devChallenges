import { Router } from "express";
import authenticate from "../middlewares/auth.middleware";
import { getUserBoards, getBoardById, createBoard, updateBoard, deleteBoard } from "../controllers/boards.controller";

const boardRouter = Router();

boardRouter.use(authenticate);

// Path: /api/v1/boards (GET)
boardRouter.get('/', getUserBoards);

// Path: /api/v1/boards/:id (GET)
boardRouter.get('/:id', getBoardById);

// Path: /api/v1/boards/ (POST)
boardRouter.post('/', createBoard);

// Path: /api/v1/boards/:id (PUT)
boardRouter.patch('/:id', updateBoard);

// Path: /api/v1/boards/:id (DELETE)
boardRouter.delete('/:id', deleteBoard);

export default boardRouter;