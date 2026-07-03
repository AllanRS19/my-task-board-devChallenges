export const DEFAULT_BOARD_TITLE = 'My First Board';

export const DEFAULT_BOARD_TASKS = [
    { name: 'Task in Progress', status: 'IN_PROGRESS' as const, icon: 'in_progress' },
    { name: 'Task Completed', status: 'COMPLETED' as const, icon: 'completed' },
    { name: "Task Won't do", status: 'WONT_DO' as const, icon: 'wont_do' },
];