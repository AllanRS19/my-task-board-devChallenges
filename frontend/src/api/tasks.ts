import { api } from './client';
import type { CreateTaskInput, UpdateTaskInput } from '../schemas/task.schema';

type TASK_STATUS_OPTION = 'COMPLETED' | 'IN_PROGRESS' | 'WONT_DO' | 'TO_DO';
type TASK_ICON_OPTIONS = 'DEV' | 'CHAT' | 'COFFEE' | 'GYM' | 'BOOKS' | 'CLOCK';

export interface Task {
    id: string;
    name: string;
    description: string | null;
    status: TASK_STATUS_OPTION;
    icon: TASK_ICON_OPTIONS;
    createdAt: string;
    updatedAt: string;
}

export const tasksApi = {
    create: (boardId: string, data: CreateTaskInput) =>
        api.post<{ newTask: Task }>(`/tasks/${boardId}`, data),
    update: (taskId: string, data: UpdateTaskInput) =>
        api.patch<{ task: Task }>(`/tasks/${taskId}`, data),
    delete: (taskId: string) => api.delete<null>(`/tasks/${taskId}`),
};