import type { Task } from "@/api/tasks";
import { cn } from "@/lib/utils";

interface TaskCardProps extends Task {
    onEdit: (task: Task) => void;
}

const TaskCard = ({ onEdit, ...task }: TaskCardProps) => {

    const { name, description, status, icon } = task;

    const taskColors = {
        IN_PROGRESS: 'bg-yellow-400',
        COMPLETED: 'bg-green-400',
        WONT_DO: 'bg-red-400',
    }

    const taskColorsMuted = {
        IN_PROGRESS: 'bg-yellow-400/40',
        COMPLETED: 'bg-green-400/40',
        WONT_DO: 'bg-red-400/40',
        TO_DO: 'bg-gray-400/40'
    };

    const taskStatusIcon = {
        IN_PROGRESS: '/time_attack_duotone.svg',
        COMPLETED: '/done_round_duotone.svg',
        WONT_DO: '/close_ring_duotone.svg',
    }

    const taskIcons = {
        DEV: '/dev.svg',
        CHAT: '/chat.svg',
        COFFEE: '/coffee.svg',
        GYM: '/gym.svg',
        BOOKS: '/books.svg',
        CLOCK: '/clock.svg'
    }

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(task);
    }

    return (
        <div
            className={cn(
                "w-full h-20 px-4 rounded-xl flex items-center justify-between cursor-pointer",
                taskColorsMuted[status]
            )}
            onClick={handleEdit}
        >
            <div className="w-full flex items-center gap-6">
                <div className="size-12 bg-white rounded-xl flex items-center justify-center">
                    <img
                        src={taskIcons[icon]}
                        alt={icon}
                        className="object-cover"
                        width={24}
                        height={24}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="font-semibold">{name}</h2>
                    {description && <p className="text-foreground">{description}</p>}
                </div>
            </div>
            {status !== 'TO_DO' &&
                <div
                    className={cn(
                        "size-12 bg-white rounded-xl flex items-center justify-center",
                        taskColors[status]
                    )}
                >
                    <img src={taskStatusIcon[status]} alt={status} />
                </div>
            }
        </div>
    )
}

export default TaskCard;