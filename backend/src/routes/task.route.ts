import { Router } from "express";
import authenticate from "../middlewares/auth.middleware";
import { createTask, deleteTask, updateTask } from "../controllers/tasks.controller";

const taskRouter = Router();

taskRouter.use(authenticate);

// Path: /api/v1/tasks (POST)
taskRouter.post('/:boardId/', createTask);

// Path: /api/v1/tasks/:id (PATCH)
taskRouter.patch('/:id', updateTask);

// Path: /api/v1/tasks/:id (DELETE)
taskRouter.delete('/:id', deleteTask);

export default taskRouter;