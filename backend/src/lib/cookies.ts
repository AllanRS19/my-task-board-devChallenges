import type { CookieOptions } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const AUTH_COOKIE_NAME = 'token';

export const authCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax', // switch to 'none' + secure:true if frontend/API are on different domains
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days — keep in sync with JWT_EXPIRES_IN
};

// clearCookie must NOT receive maxAge, or Express recalculates `expires`
// into the future instead of deleting the cookie. Keep only the
// identity-matching attributes here.
export const clearAuthCookieOptions: CookieOptions = {
    httpOnly: authCookieOptions.httpOnly,
    secure: authCookieOptions.secure,
    sameSite: authCookieOptions.sameSite,
};