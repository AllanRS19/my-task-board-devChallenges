import { Link } from "react-router-dom";
import type { Board } from "@/api/boards";
import { formatDate } from "@/lib/utils";
import { ArrowUpRight, ListChecks, Pencil, Trash2 } from "lucide-react";

interface BoardCardProps extends Board {
    onEdit: (board: Board) => void;
    onDelete: (board: Board) => void;
}

const BoardCard = ({ onEdit, onDelete, ...board }: BoardCardProps) => {

    const { id, title, description, tasksCount, updatedAt } = board;

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEdit(board);
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(board);
    };

    return (
        <Link
            to={`/boards/${id}`}
            className="bg-white group relative block rounded-md bg-paper border border-paper-line px-5 py-4
                       shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                       hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.18)] hover:-translate-y-0.5
                       hover:border-brand-600
                       transition-all duration-150
                       focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-2"
        >
            <span
                aria-hidden="true"
                className="absolute -top-1.5 left-5 h-3 w-8 rounded-b-sm
                           bg-[radial-gradient(circle_at_30%_30%,var(--color-gold),var(--color-gold-dark))]"
            />

            <div className="flex items-start justify-between gap-2">
                <h2 className="font-display italic font-semibold text-lg text-charcoal leading-snug">
                    {title}
                </h2>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={handleEdit}
                        aria-label={`Edit ${title}`}
                        className="p-1 rounded cursor-pointer text-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                                   hover:text-gold-dark hover:bg-ink/5 transition-all
                                   focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-gold"
                    >
                        <Pencil size={15} />
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        aria-label={`Delete ${title}`}
                        className="p-1 rounded cursor-pointer text-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                                   hover:text-red-600 hover:bg-rust/10 transition-all
                                   focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-gold"
                    >
                        <Trash2 size={15} />
                    </button>
                    <ArrowUpRight
                        className="text-brand-600 group-hover:text-gold-dark transition-colors mt-0.5"
                        size={18}
                    />
                </div>
            </div>

            {description && (
                <p className="mt-1.5 text-sm text-foreground line-clamp-2 leading-relaxed">
                    {description}
                </p>
            )}

            <div className="mt-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-charcoal">
                    <ListChecks size={13} className="text-gold-dark" />
                    {tasksCount} {tasksCount === 1 ? 'task' : 'tasks'}
                </span>

                <p className="text-[11px] tracking-wide uppercase text-foreground">
                    Updated {formatDate(updatedAt)}
                </p>
            </div>
        </Link>
    );
};

export default BoardCard;