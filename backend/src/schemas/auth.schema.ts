import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt's effective limit
const MAX_NAME_LENGTH = 50; // matches @db.VarChar(50)

// Base building blocks, reused across schemas
const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .pipe(z.email("Invalid email format"));

const signUpPasswordSchema = z
    .string()
    .nonempty('Password is required')
    .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
    .max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`);

export const signUpSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(MAX_NAME_LENGTH, `Name must be at most ${MAX_NAME_LENGTH} characters`),
    email: emailSchema,
    password: signUpPasswordSchema,
});

export const signInSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required').max(MAX_PASSWORD_LENGTH, `Password must be at most ${MAX_PASSWORD_LENGTH} characters`)
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;