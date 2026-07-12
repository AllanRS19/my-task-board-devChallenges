import { useState } from "react";
import { CircuitBoard, Plus } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCreateBoard, useDeleteBoard, useGetUserBoards, useUpdateBoard } from "@/hooks/useBoard";
import type { Board } from "@/api/boards";
import BoardCard from "@/components/BoardCard";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EntityModal } from "@/components/shared/EntityModal";

const BoardsPage = () => {

    const { data } = useCurrentUser();
    const { data: userBoardsData, isLoading, isError } = useGetUserBoards();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);
    const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

    const createBoard = useCreateBoard();
    const updateBoard = useUpdateBoard(editingBoard?.id ?? '');
    const deleteBoard = useDeleteBoard();

    if (!data) return null;

    const { user } = data;

    console.log(userBoardsData?.boards);

    return (
        <section className="min-h-screen w-full max-w-4xl mx-auto py-8 px-8 md:px-0">
            <Navbar userName={user.name} />

            <div className="mt-8 flex items-center justify-between">
                <h1 className="font-display italic font-semibold text-2xl text-charcoal">
                    Your boards
                </h1>
                <Button className="cursor-pointer" onClick={() => setIsCreateOpen(true)}>
                    <Plus size={16} className="mr-1.5" />
                    Create board
                </Button>
            </div>

            {isLoading && <p className="text-gray-500 mt-8">Loading your boards...</p>}
            {isError && <p className="text-red-600 mt-8">We couldn't load your boards. Try refreshing.</p>}


            {userBoardsData?.boards.length ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {userBoardsData?.boards.map((board: Board) => (
                        <BoardCard
                            key={board.id}
                            {...board}
                            onEdit={setEditingBoard}
                            onDelete={setDeletingBoard}
                        />
                    ))}
                </div>
            ) : (
                !isLoading && (
                    <Empty className="bg-white mt-6 shadow-md w-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <CircuitBoard />
                            </EmptyMedia>
                            <EmptyTitle>No Boards Yet</EmptyTitle>
                            <EmptyDescription>
                                You haven&apos;t created any boards yet. Get started by creating
                                your first boards.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent className="flex-row justify-center gap-2">
                            <Button className="cursor-pointer" onClick={() => setIsCreateOpen(true)}>Create Board</Button>
                        </EmptyContent>
                    </Empty>
                )
            )}

            {/* Create */}
            <EntityModal
                entityType="board"
                mode="create"
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                isSubmitting={createBoard.isPending}
                onSubmit={(newBoardData) =>
                    createBoard.mutate(newBoardData, { onSuccess: () => setIsCreateOpen(false) })
                }
            />

            {/* Edit */}
            {editingBoard && (
                <EntityModal
                    entityType="board"
                    mode="edit"
                    isOpen={true}
                    initialData={editingBoard}
                    onClose={() => setEditingBoard(null)}
                    isSubmitting={updateBoard.isPending}
                    onSubmit={(updatedData) =>
                        updateBoard.mutate(updatedData, { onSuccess: () => setEditingBoard(null) })
                    }
                />
            )}

            {/* Delete confirmation */}
            <AlertDialog open={!!deletingBoard} onOpenChange={(open) => !open && setDeletingBoard(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{deletingBoard?.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this board and all of its tasks. This can't be undone.
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
                                    if (deletingBoard) {
                                        deleteBoard.mutate(deletingBoard.id, {
                                            onSuccess: () => setDeletingBoard(null),
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
    )
}

export default BoardsPage;