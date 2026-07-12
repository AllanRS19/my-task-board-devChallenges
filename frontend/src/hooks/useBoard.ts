import { boardApi } from "@/api/boards";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateBoardInput, UpdateBoardInput } from "@/schemas/board.schema";

export function useGetUserBoards() {
    return useQuery({
        queryKey: ['boards'],
        queryFn: boardApi.getUserBoards,
        retry: true, // don't retry on 401 — that's an expected "logged out" state, not a transient failure
    });
}

export function useBoard(id: string) {
    return useQuery({
        queryKey: ['boards', id],
        queryFn: () => boardApi.getById(id),
        enabled: !!id, // don't fire until a real id is available
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBoardInput) => boardApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        }
    })
}

export function useUpdateBoard(id: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateBoardInput) => boardApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
            queryClient.invalidateQueries({ queryKey: ['boards', id] });
        },
    });
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => boardApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards'] });
        },
    });
}