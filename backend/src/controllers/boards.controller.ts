import type { Response } from "express";
import prisma from "../lib/db";
import { Prisma } from "../generated/prisma/client";
import { sendResponse } from "../lib/utils";
import { DEFAULT_BOARD_TASKS } from "../lib/defaultBoard";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { parseBody } from "../lib/schemaValidate";
import { createBoardSchema, updateBoardSchema } from "../schemas/board.schema";

export const getUserBoards = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.userId) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        const userBoards = await prisma.board.findMany({
            where: { owner_id: req.userId },
            select: {
                id: true,
                title: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { updatedAt: 'desc' },
        });

        return sendResponse(res, 200, true, 'Boards fetched successfully', {
            boardsCount: userBoards.length,
            boards: userBoards
        });

    } catch (error) {
        console.error(error instanceof Error ? error.message : 'We could not fetch your boards');
        return sendResponse(res, 500, false, 'There was an error fetching your boards');
    }

}

export const getBoardById = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.userId) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        const { id } = req.params;

        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        // Get a board including its tasks
        const board = await prisma.board.findFirst({
            where: { id, owner_id: req.userId },
            select: {
                title: true,
                description: true,
                tasks: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!board) return sendResponse(res, 404, false, 'Board not found');

        // Return the board information
        return sendResponse(res, 200, true, 'Board fetched successfully', { board });

    } catch (error) {
        console.error(error instanceof Error ? error.message : 'We could not fetch your boards');
        return sendResponse(res, 500, false, 'There was an error fetching your boards');
    }

}

export const createBoard = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.userId) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        // Check the data in the req.body against the schema and confirm if it meets requirements
        const parsed = parseBody(createBoardSchema, req.body, res);
        if (!parsed.success) return;

        // Create a new board for the user
        const newBoard = await prisma.board.create({
            data: {
                ...parsed.data,
                owner_id: req.userId,
                tasks: {
                    create: DEFAULT_BOARD_TASKS
                }
            },
            select: { id: true, title: true, createdAt: true, updatedAt: true }
        });

        return sendResponse(res, 201, true, 'Board created successfully', {
            board: {
                title: parsed.data.title,
                boardId: newBoard.id
            }
        });

    } catch (error) {
        console.error(error instanceof Error ? error.message : 'We could not create this board');
        return sendResponse(res, 500, false, 'There was an error creating this board');
    }
}

export const updateBoard = async (req: AuthenticatedRequest, res: Response) => {

    try {

        // Guard to check if user is authenticated
        if (!req.userId) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        const { id } = req.params;

        // Check that ID is not empty and is a string
        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        // Check the data in the req.body against the schema and confirm if it meets requirements
        const parsed = parseBody(updateBoardSchema, req.body, res);
        if (!parsed.success) return; // parseBody already sent the 400 response

        // Update board to new title
        const board = await prisma.board.update({
            data: parsed.data,
            where: { id, owner_id: req.userId }
        });

        return sendResponse(res, 200, true, 'Board updated successfully', { board });

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return sendResponse(res, 404, false, 'Board not found');
        }

        console.error(error instanceof Error ? error.message : 'We could not update this board');
        return sendResponse(res, 500, false, 'There was an error updating this board');

    }
}

export const deleteBoard = async (req: AuthenticatedRequest, res: Response) => {

    try {

        if (!req.userId) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        const { id } = req.params;

        // Check that ID is not empty and is a string
        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        await prisma.board.delete({
            where: { id, owner_id: req.userId }
        });

        return sendResponse(res, 200, true, 'Board deleted successfully');

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return sendResponse(res, 404, false, 'Board not found');
        }

        console.error(error instanceof Error ? error.message : 'We could not delete this board');
        return sendResponse(res, 500, false, 'There was an error deleting this board');

    }

}