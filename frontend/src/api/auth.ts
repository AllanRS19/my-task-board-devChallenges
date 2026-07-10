import { api } from "./client";
import type { SignInInput, SignUpInput } from "../schemas/auth.schema";

export interface User {
    id: string;
    name: string;
    email: string;
}

export const authApi = {
    signUp: (data: SignUpInput) => api.post<{ user: { id: string; email: string } }>('/auth/sign-up', data),
    signIn: (data: SignInInput) => api.post<null>('/auth/sign-in', data),
    signOut: () => api.post<null>('/auth/sign-out'),
    getMe: () => api.get<{ user: User }>('/auth/me'),
};