import { z } from 'zod';

const MIN_TASK_NAME_LENGTH = 1;
const MAX_TASK_NAME_LENGTH = 30;
const MAX_TASK_DESCRIPTION_LENGTH = 200;

export const TASK_STATUS_OPTIONS = ['COMPLETED', 'IN_PROGRESS', 'WONT_DO', 'TO_DO'] as const;
export const TASK_ICON_OPTIONS = ['DEV', 'CHAT', 'COFFEE', 'GYM', 'BOOKS', 'CLOCK'] as const;

const taskSchema = z.object({
    name: z
        .string()
        .trim()
        .min(MIN_TASK_NAME_LENGTH, 'Task name is required')
        .max(MAX_TASK_NAME_LENGTH, `Task name cannot exceed ${MAX_TASK_NAME_LENGTH} characters`),
    description: z
        .string()
        .trim()
        .max(MAX_TASK_DESCRIPTION_LENGTH, `Description cannot exceed ${MAX_TASK_DESCRIPTION_LENGTH} characters`)
        .nullable()
        .optional(),
    status: z.enum(TASK_STATUS_OPTIONS, { error: 'Status must be one of the allowed values' }),
    icon: z.enum(TASK_ICON_OPTIONS, { error: 'Icon must be one of the allowed values' }),
});

export const createTaskSchema = taskSchema;

export const updateTaskSchema = taskSchema
    .partial()
    .refine(
        (data) => data.name !== undefined || data.description !== undefined || data.status !== undefined || data.icon !== undefined,
        { error: 'Provide at least one field to update' }
    );

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskStatus = typeof TASK_STATUS_OPTIONS[number];
export type TaskIcon = typeof TASK_ICON_OPTIONS[number];