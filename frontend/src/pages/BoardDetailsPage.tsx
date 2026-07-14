import { useState } from "react";
import { useParams } from "react-router-dom";
import { PencilLine } from "lucide-react";
import { useBoard } from "@/hooks/useBoard";
import type { Task } from "@/api/tasks";
import TaskCard from "@/components/TaskCard";
import { EntityModal } from "@/components/shared/EntityModal";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/useTask";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const BoardDetailsPage = () => {

    const { id } = useParams<{ id: string }>();

    const { data, isLoading, isError } = useBoard(id!);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [deletingTask, setDeletingTask] = useState<Task | null>(null);

    const createTask = useCreateTask(id!);
    const updateTask = useUpdateTask(id!);
    const deleteTask = useDeleteTask(id!);

    if (!data) return null;

    const { board: boardDetails } = data;

    return (
        <main className="w-full mt-8">

            {isLoading && <p className="text-gray-500 mt-8">Loading board…</p>}
            {isError || !data && <p className="text-red-600 mt-8">We couldn't load this board.</p>}

            <header className="w-full text-center">
                <h1 className="font-display font-semibold text-4xl text-charcoal flex items-center gap-2">
                    {boardDetails.title}
                    <PencilLine size={16} className="cursor-pointer stroke-3" />
                </h1>
                {boardDetails.description && <p className="text-muted mt-1">{boardDetails.description}</p>}
            </header>

            <section className="w-full mt-8">
                {boardDetails.tasks.length ? (
                    <div className="w-full flex flex-col gap-6">
                        {boardDetails.tasks.map((task: Task) => (
                            <TaskCard
                                key={task.id}
                                {...task}
                                onEdit={setEditingTask}
                            />
                        ))}

                        <Button
                            className="h-20 text-xl cursor-pointer flex items-center justify-start gap-6 bg-orange-400/40 hover:bg-orange-400/80"
                            onClick={() => setIsCreateOpen(true)}
                        >
                            <div className="size-12 bg-orange-400 rounded-xl flex items-center justify-center">
                                <img
                                    src="/add_round_duotone.svg"
                                    alt="Plus Icon"
                                    width={24}
                                    height={24}
                                />
                            </div>
                            <span className="text-base text-black">Add a new task</span>
                        </Button>
                    </div>
                ) : (
                    !isLoading && (
                        <Empty className="bg-white mt-6 shadow-md w-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PencilLine />
                                </EmptyMedia>
                                <EmptyTitle>No Tasks on this board Yet</EmptyTitle>
                                <EmptyDescription>
                                    You haven&apos;t created any tasks on this board yet. Get started by creating
                                    your task.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent className="flex-row justify-center gap-2">
                                <Button className="cursor-pointer" onClick={() => setIsCreateOpen(true)}>Create Task</Button>
                            </EmptyContent>
                        </Empty>
                    )
                )}

                {/* Create */}
                <EntityModal
                    entityType="task"
                    mode="create"
                    isOpen={isCreateOpen}
                    onClose={() => setIsCreateOpen(false)}
                    isSubmitting={createTask.isPending}
                    onSubmit={(newTaskData) =>
                        createTask.mutate(newTaskData, { onSuccess: () => setIsCreateOpen(false) })
                    }
                />

                {/* Edit */}
                {editingTask && (
                    <EntityModal
                        entityType="task"
                        mode="edit"
                        isOpen={true}
                        initialData={editingTask}
                        onClose={() => setEditingTask(null)}
                        isSubmitting={updateTask.isPending}
                        onSubmit={(updatedData) =>
                            updateTask.mutate(
                                { taskId: editingTask.id, data: updatedData },
                                { onSuccess: () => setEditingTask(null) }
                            )
                        }
                        onDelete={() => {
                            setDeletingTask(editingTask);
                            setEditingTask(null); // close the edit modal so the confirm dialog isn't stacked behind it
                        }}
                    />
                )}

                {/* Delete confirmation */}
                <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete "{deletingTask?.name}"?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete this task. This can't be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                                <Button variant="secondary">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    variant="danger"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        if (deletingTask) {
                                            deleteTask.mutate(deletingTask.id, {
                                                onSuccess: () => setDeletingTask(null),
                                            });
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </section>
        </main>
    )
}

export default BoardDetailsPage;