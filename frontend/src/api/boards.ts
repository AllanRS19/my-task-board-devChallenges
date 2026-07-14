import type { CreateBoardInput, UpdateBoardInput } from "@/schemas/board.schema";
import { api } from "./client";
import type { Task } from "./tasks";

export interface Board {
    id: string;
    title: string;
    description: string | null;
    tasksCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface BoardWithTasks {
    id: string;
    title: string;
    description: string | null;
    tasks: Task[];
}

export const boardApi = {
    getUserBoards: () => api.get<{ boards: Board[] }>('/boards'),
    getById: (id: string) => api.get<{ board: BoardWithTasks }>(`/boards/${id}`),
    create: (data: CreateBoardInput) => api.post<{ board: Board }>('/boards', data),
    update: (id: string, data: UpdateBoardInput) => api.patch<{ board: Board }>(`/boards/${id}`, data),
    delete: (id: string) => api.delete<null>(`/boards/${id}`),
};