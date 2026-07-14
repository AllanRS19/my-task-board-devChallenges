export const DEFAULT_BOARD_TITLE = 'My First Board';

export const DEFAULT_BOARD_TASKS = [
    { name: 'Task in Progress', status: 'IN_PROGRESS' as const, icon: 'CLOCK' as const },
    { name: 'Task Completed', status: 'COMPLETED' as const, icon: 'DEV' as const },
    { name: "Task Won't do", status: 'WONT_DO' as const, icon: 'COFFEE' as const },
];