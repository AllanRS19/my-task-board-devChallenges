import type { Response } from 'express';
import type { ZodType } from 'zod';
import { sendResponse } from './utils';

export function parseBody<T>(
    schema: ZodType<T>,
    body: unknown,
    res: Response
): { success: true; data: T } | { success: false } {
    const result = schema.safeParse(body);

    if (!result.success) {
        const firstError = result.error.issues[0];
        sendResponse(res, 400, false, firstError?.message ?? 'Invalid request data');
        return { success: false };
    }

    return { success: true, data: result.data };
}