import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import type { SignInInput, SignUpInput } from '../schemas/auth.schema';

export type AuthMode = 'sign-in' | 'sign-up';

export function useCurrentUser() {
    return useQuery({
        queryKey: ['me'],
        queryFn: authApi.getMe,
        retry: false, // don't retry on 401 — that's an expected "logged out" state, not a transient failure
    });
}

export function useAuthenticate(mode: AuthMode) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SignInInput | SignUpInput) =>
            mode === 'sign-in'
                ? authApi.signIn(data as SignInInput)
                : authApi.signUp(data as SignUpInput),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
        }
    });
}

export function useSignOut() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: authApi.signOut,
        onSuccess: () => {
            queryClient.setQueryData(['me'], null);
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}