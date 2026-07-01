import { response, type Request, type RequestHandler, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import prisma from "../lib/db";
import { Prisma } from "../generated/prisma/client";
import { isEmailValid, normalizeEmail, sendResponse } from "../lib/utils";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { AUTH_COOKIE_NAME, authCookieOptions } from "../lib/cookies";

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

// Fail fast at startup, not per-request
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'];

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

export const signUp: RequestHandler = async (req: Request, res: Response) => {

    try {
        const { name, email, password } = req.body;

        // Validating inconming data before making network requests
        if (!name || !email || !password) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        // Checking if password is a string
        if (typeof password !== "string") {
            return sendResponse(res, 400, false, 'Password must be a string');
        }

        // Checking if password meets requirements
        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            return sendResponse(res, 400, false, `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`)
        }

        // Normalize email to eliminate white spaces and make it lowercase
        const normalizedEmail = normalizeEmail(email);

        // Check if user's email format is valid
        if (!isEmailValid(normalizedEmail)) {
            return sendResponse(res, 400, false, 'Invalid email format');
        }

        // Hash user password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // No pre-check for existing email — rely on the unique constraint
        // (via the P2002 catch below) as the single source of truth.
        // This avoids a redundant round-trip AND avoids a race condition
        // where two requests could both pass a separate findUnique check.

        // Create user in database
        const newUser = await prisma.user.create({
            data: {
                name: String(name).trim(),
                email: normalizedEmail,
                password: hashedPassword
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
        const { email, password } = req.body;

        // Validating inconming data before making network requests
        if (!email || !password) {
            return sendResponse(res, 400, false, 'All fields are required');
        }

        // Checking if password is a string
        if (typeof password !== "string") {
            return sendResponse(res, 400, false, 'Password must be a string');
        }

        // Checking if password meets requirements
        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
            return sendResponse(res, 400, false, `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH}`)
        }

        // Normalize email to eliminate white spaces and make it lowercase
        const normalizedEmail = normalizeEmail(email);

        // Check if user's email format is valid
        if (!isEmailValid(normalizedEmail)) {
            return sendResponse(res, 400, false, 'Invalid email format');
        }

        // Find user in the DB
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
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
        const token = jwt.sign({ userId: user?.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions);

        return sendResponse(res, 201, true, 'Login successful');

    } catch (error) {
        console.error(error instanceof Error ? error.message : "We couldn't log you in");
        return sendResponse(res, 500, false, 'There was an error with your request');
    }
};

export const signOut: RequestHandler = async (req: AuthenticatedRequest, res: Response) => {
    try {
        res.clearCookie(AUTH_COOKIE_NAME);
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