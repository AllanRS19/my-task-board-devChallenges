import { type Request, type RequestHandler, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import prisma from "../lib/db";
import { Prisma } from "../generated/prisma/client";
import { sendResponse } from "../lib/utils";
import { AUTH_COOKIE_NAME, authCookieOptions, clearAuthCookieOptions } from "../lib/cookies";
import { parseBody } from "../lib/schemaValidate";
import { signInSchema, signUpSchema } from "../schemas/auth.schema";
import { DEFAULT_BOARD_TASKS, DEFAULT_BOARD_TITLE } from "../lib/defaultBoard";

const SALT_ROUNDS = 10;

// Fail fast at startup, not per-request
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const signUp: RequestHandler = async (req: Request, res: Response) => {

    try {

        const parsed = parseBody(signUpSchema, req.body, res);

        if (!parsed.success) return;

        const { password } = parsed.data;

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // No pre-check for existing email — rely on the unique constraint
        // (via the P2002 catch below) as the single source of truth.
        // This avoids a redundant round-trip AND avoids a race condition
        // where two requests could both pass a separate findUnique check.

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                ...parsed.data,
                password: hashedPassword,
                boards: {
                    create: [
                        {
                            title: DEFAULT_BOARD_TITLE,
                            tasks: {
                                create: DEFAULT_BOARD_TASKS
                            }
                        }
                    ]
                }
            },
            select: {
                id: true,
                email: true
            }
        });

        // Generate JWT Token
        const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

        return sendResponse(res, 201, true, 'User created successfully', {
            user: newUser
        });

    } catch (error) {

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return sendResponse(res, 409, false, 'Email is already in use');
        }

        console.error('signUp error:', error);
        return sendResponse(res, 500, false, 'There was an error creating your account');

    }

};

export const signIn: RequestHandler = async (req: Request, res: Response) => {
    try {

        const parsed = parseBody(signInSchema, req.body, res);

        if (!parsed.success) return;

        const { email, password } = parsed.data;

        // Find user in the DB
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, password: true }
        });

        // Always run bcrypt.compare, even if user is null, using a dummy hash.
        // This keeps response time roughly constant whether or not the email
        // exists, so an attacker can't use timing to enumerate valid accounts.

        const passwordHash = user?.password ?? '$2b$10$invalidsaltinvalidsaltinvalidsalt.hashvalue';
        const isPasswordValid = await bcrypt.compare(password, passwordHash);

        if (!user || !isPasswordValid) {
            return sendResponse(res, 401, false, 'Email or password is incorrect');
        }

        // Issue a session
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

        return sendResponse(res, 200, true, 'Login successful');

    } catch (error) {
        console.error(error instanceof Error ? error.message : "We couldn't log you in");
        return sendResponse(res, 500, false, 'There was an error with your request');
    }
};

export const signOut: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        res.clearCookie(AUTH_COOKIE_NAME, clearAuthCookieOptions);
        return sendResponse(res, 200, true, 'Logged out successfully');
    } catch (error) {
        console.error('sign-out error:', error);
        return sendResponse(res, 500, false, 'There was an error with your request');
    }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId },
            select: { id: true, name: true, email: true },
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found', data: null });
        }

        return res.status(200).json({ success: true, message: 'OK', data: { user } });
    } catch (error) {
        console.error('getMe error:', error);
        return res.status(500).json({ success: false, message: 'Server error', data: null });
    }
};