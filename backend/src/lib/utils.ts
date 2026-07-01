import type { Response } from "express";

// Small helper to cut down on repeated response boilerplate
export const sendResponse = (
    res: Response,
    status: number,
    success: boolean,
    message: string,
    data: unknown = null
) => res.status(status).json({ success, message, data });

// Normalize email
export const normalizeEmail = (email: string) => String(email).trim().toLowerCase();

// Helper to validate email address format
export const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) return false;

    return true;
}