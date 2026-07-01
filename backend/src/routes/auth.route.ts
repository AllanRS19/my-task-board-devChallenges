import { Router } from "express";
import { getMe, signIn, signOut, signUp } from "../controllers/auth.controller";
import authenticate from "../middlewares/auth.middleware";

const authRouter = Router();

// Path: /api/v1/auth/sign-up (POST)
authRouter.post('/sign-up', signUp);

// Path: /api/v1/auth/sign-in (POST)
authRouter.post('/sign-in', signIn);

// Path: /api/v1/auth/sign-out (POST)
authRouter.post('/sign-out', signOut);

authRouter.get('/me', authenticate, getMe);

export default authRouter;