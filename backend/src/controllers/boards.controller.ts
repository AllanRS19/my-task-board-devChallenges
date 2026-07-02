import type { Response } from "express";
import prisma from "../lib/db";
import { Prisma } from "../generated/prisma/client";
import { sendResponse } from "../lib/utils";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 50; // matches @db.VarChar(50)

export const getUserBoards = async (req: AuthenticatedRequest, res: Response) => {

    try {
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
        const { id } = req.params;

        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        const board = await prisma.board.findFirst({
            where: { id, owner_id: req.userId },
            select: { id: true, title: true }
        });

        if (!board) return sendResponse(res, 404, false, 'Board not found');

        return sendResponse(res, 200, true, 'Board fetched successfully', { board });

    } catch (error) {
        console.error(error instanceof Error ? error.message : 'We could not fetch your boards');
        return sendResponse(res, 500, false, 'There was an error fetching your boards');
    }

}

export const createBoard = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== 'string') {
            return sendResponse(res, 400, false, 'Title is required');
        }

        const trimmedTitle = title.trim();

        if (trimmedTitle.length < MIN_TITLE_LENGTH || trimmedTitle.length > MAX_TITLE_LENGTH) {
            return sendResponse(res, 400, false, `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`);
        }

        const newBoard = await prisma.board.create({
            data: {
                title: String(title).trim(),
                owner_id: req.userId!
            },
            select: { id: true, title: true, createdAt: true, updatedAt: true }
        });

        return sendResponse(res, 201, true, 'Board created successfully', {
            board: {
                title: trimmedTitle,
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

        const { id } = req.params;
        const { title } = req.body;

        // Check that ID is not empty and is a string
        if (!id || typeof id !== "string") return sendResponse(res, 400, false, 'Invalid board id');

        // Check that title is not empty and is a string
        if (!title || typeof title !== 'string') {
            return sendResponse(res, 400, false, 'Title is required');
        }

        const trimmedTitle = title.trim();

        // Check that title is meets the length requirements
        if (trimmedTitle.length < MIN_TITLE_LENGTH || trimmedTitle.length > MAX_TITLE_LENGTH) {
            return sendResponse(res, 400, false, `Title must be between ${MIN_TITLE_LENGTH} and ${MAX_TITLE_LENGTH} characters`);
        }

        // Update board to new title
        const board = await prisma.board.update({
            data: { title: trimmedTitle },
            where: { id, owner_id: req.userId }
        });

        return sendResponse(res, 200, true, 'Board updated successfully', {
            board
        });

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