import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';

export function useCreateTask(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateTaskInput) => tasksApi.create(boardId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
        },
    });
}

export function useUpdateTask(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
            tasksApi.update(taskId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
        },
    });
}

export function useDeleteTask(boardId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId: string) => tasksApi.delete(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['boards', boardId] });
        },
    });
}