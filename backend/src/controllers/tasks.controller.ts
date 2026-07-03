import type { Response } from "express"
import type { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { sendResponse } from "../lib/utils"
import { parseBody } from "../lib/schemaValidate";
import prisma from "../lib/db";
import { createTaskSchema, updateTaskSchema } from "../schemas/task.schema";
import { Prisma } from "../generated/prisma/client";

export const createTask = async (req: AuthenticatedRequest, res: Response) => {
    try {

        // Check if user is authenticated
        if (!req.userId) return sendResponse(res, 401, false, 'Not authenticated');

        const { boardId } = req.params;

        // Check that ID is not empty and is a string
        if (!boardId || typeof boardId !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        const parsed = parseBody(createTaskSchema, req.body, res);
        if (!parsed.success) return;

        const newTask = await prisma.task.create({
            data: {
                ...parsed.data,
                board: {
                    connect: {
                        id: boardId,
                        owner_id: req.userId
                    }
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                icon: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return sendResponse(res, 201, true, 'Task created successfully', { newTask });

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') return sendResponse(res, 404, false, 'Board not found');
            if (error.code === 'P2002') return sendResponse(res, 409, false, 'A task with this name already exists on this board');
        }

        console.error(error instanceof Error ? error.message : 'We could not create this task');
        return sendResponse(res, 500, false, 'There was an error creating this task');
    }
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    try {

        // Check if user is authenticated
        if (!req.userId) return sendResponse(res, 401, false, 'Not authenticated');

        const { id } = req.params;
        if (!id || typeof id !== 'string') return sendResponse(res, 400, false, 'Invalid task id');

        const parsed = parseBody(updateTaskSchema, req.body, res);
        if (!parsed.success) return;

        const task = await prisma.task.update({
            data: parsed.data,
            where: {
                id,
                board: {
                    owner_id: req.userId
                }
            },
            select: {
                id: true,
                name: true,
                description: true,
                status: true,
                icon: true,
            }
        });

        return sendResponse(res, 200, true, 'Task updated successfully', { task });

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') return sendResponse(res, 404, false, 'Task not found');
            if (error.code === 'P2002') return sendResponse(res, 409, false, 'A task with this name already exists on this board');
        }

        console.error(error instanceof Error ? error.message : 'We could not update this task');
        return sendResponse(res, 500, false, 'There was an error updating this task');

    }
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {

        if (!req.userId) return sendResponse(res, 401, false, 'Not authenticated');

        const { id } = req.params;
        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid task id');

        await prisma.task.delete({
            where: {
                id,
                board: { owner_id: req.userId }
            }
        });

        return sendResponse(res, 200, true, 'Task deleted successfully');

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return sendResponse(res, 404, false, 'Task not found');
        }

        console.error(error instanceof Error ? error.message : 'We could not delete this task');
        return sendResponse(res, 500, false, 'There was an error deleting this task');

    }
}