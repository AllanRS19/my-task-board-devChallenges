import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const AUTH_COOKIE_NAME = 'token';

export const authCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict', // switch to 'none' + secure:true if frontend/API are on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — keep in sync with JWT_EXPIRES_IN
};