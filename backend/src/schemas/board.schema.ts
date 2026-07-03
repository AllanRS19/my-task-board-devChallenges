import { z } from 'zod';

const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 50; // matches @db.VarChar(50)
const MAX_DESCRIPTION_LENGTH = 200; // matches @db.VarChar(200)

export const boardSchema = z.object({
    title: z
        .string()
        .trim()
        .min(MIN_TITLE_LENGTH, "Title is required")
        .max(MAX_TITLE_LENGTH, `Title must be at most ${MAX_TITLE_LENGTH} characters`),
    description: z
        .string()
        .trim()
        .max(MAX_DESCRIPTION_LENGTH, `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`)
        .nullable()
        .optional(),
});

export const createBoardSchema = boardSchema;

export const updateBoardSchema = boardSchema
    .partial()
    .refine(
        (data) => data.title !== undefined || data.description !== undefined,
        { error: 'Provide at least a title or description to update' }
    );

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;