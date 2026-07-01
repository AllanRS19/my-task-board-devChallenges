import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { sendResponse } from "../lib/utils";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

interface CustomJwtPayload extends JwtPayload {
    userId: string;
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;
        console.log('cookies received:', req.cookies);
        console.log('token value:', token);

        if (!token) {
            return sendResponse(res, 401, false, 'Not authenticated');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
        req.userId = decoded.userId;

        next();
    } catch (error) {
        return sendResponse(res, 401, false, 'Invalid or expired session');
    }
}

export default authenticate;