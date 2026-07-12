import { type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from "@/schemas/auth.schema";
import { useAuthenticate } from "@/hooks/useAuth";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

interface AuthFormProps {
    authScreen: 'sign-in' | 'sign-up';
    setAuthScreen: React.Dispatch<SetStateAction<'sign-in' | 'sign-up'>>;
}

type AuthFormValues = SignInInput | SignUpInput;

const AuthForm = ({ authScreen, setAuthScreen }: AuthFormProps) => {

    const navigate = useNavigate();

    const { mutate, isPending, isError } = useAuthenticate(authScreen);

    const authSchema = authScreen === 'sign-in' ? signInSchema : signUpSchema;

    const { register, handleSubmit, formState: { errors } } = useForm<AuthFormValues>({
        resolver: zodResolver(authSchema),
    });

    const onSubmit = (data: AuthFormValues) => {
        mutate(data, { onSuccess: () => navigate('/boards') });
    };

    return (
        <div className="min-h-screen bg-brand-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Task Boards</h1>
                    <p className="text-gray-500 mt-1">
                        {authScreen === 'sign-in' ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
                    {isError && (
                        <div role="alert" className="rounded px-3.5 py-2.5 text-sm bg-red-50 border border-red-200 text-red-700">
                            Something went wrong. Please try again later
                        </div>
                    )}
                    {authScreen === 'sign-up' && (
                        <div>
                            <Input
                                label="Name"
                                type="text"
                                autoComplete="name"
                                required
                                {...register('name' as keyof AuthFormValues)}
                            />
                            {'name' in errors && errors.name && (
                                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <Input
                            label="Email"
                            type="email"
                            autoComplete="email"
                            required
                            {...register('email')}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                    </div>

                    <div>
                        <Input
                            label="Password"
                            type="password"
                            autoComplete={authScreen === 'sign-up' ? 'new-password' : 'current-password'}
                            required
                            {...register('password')}
                        />
                        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                    </div>

                    <Button type="submit" className="w-full cursor-pointer" size="lg" loading={isPending}>
                        {isPending
                            ? (authScreen === 'sign-in' ? 'Signing in…' : 'Creating account…')
                            : (authScreen === 'sign-in' ? 'Sign in' : 'Sign up')}
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    {authScreen === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button
                        type="button"
                        className="text-brand-600 font-medium hover:underline"
                        onClick={() => setAuthScreen(authScreen === 'sign-in' ? 'sign-up' : 'sign-in')}
                    >
                        {authScreen === 'sign-in' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    )
}

export default AuthForm;