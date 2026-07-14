import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    createBoardSchema,
    updateBoardSchema,
    type CreateBoardInput,
    type UpdateBoardInput,
} from "@/schemas/board.schema";
import {
    createTaskSchema,
    updateTaskSchema,
    type CreateTaskInput,
    type UpdateTaskInput,
} from "@/schemas/task.schema";
import type { Board } from "@/api/boards";
import type { Task } from "@/api/tasks";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

type EntityModalProps =
    | { entityType: 'board'; mode: 'create'; isOpen: boolean; onClose: () => void; onSubmit: (data: CreateBoardInput) => void; isSubmitting?: boolean }
    | { entityType: 'board'; mode: 'edit'; isOpen: boolean; onClose: () => void; onSubmit: (data: UpdateBoardInput) => void; isSubmitting?: boolean; initialData: Board }
    | { entityType: 'task'; mode: 'create'; isOpen: boolean; onClose: () => void; onSubmit: (data: CreateTaskInput) => void; isSubmitting?: boolean }
    | { entityType: 'task'; mode: 'edit'; isOpen: boolean; onClose: () => void; onSubmit: (data: UpdateTaskInput) => void; isSubmitting?: boolean; initialData: Task, onDelete?: () => void; isDeleting?: boolean; };

export function EntityModal(props: EntityModalProps) {
    const { isOpen, onClose, entityType, mode } = props;

    const title =
        entityType === 'board'
            ? mode === 'create' ? 'Create a new board' : 'Edit board'
            : mode === 'create' ? 'Add a new task' : 'Edit task';

    const formKey = `${entityType}-${mode}-${mode === 'edit' ? props.initialData.id : 'new'}`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="w-full h-[calc(100vh-3rem)] flex flex-col overflow-y-auto"

            >
                <DialogHeader>
                    <DialogTitle className="text-lg">{title}</DialogTitle>
                </DialogHeader>

                {entityType === 'board' ? (
                    <BoardForm key={formKey} {...props} />
                ) : (
                    <TaskForm key={formKey} {...props} />
                )}
            </DialogContent>
        </Dialog>
    );
}

const BoardForm = (props: Extract<EntityModalProps, { entityType: 'board' }>) => {
    const { mode, onClose, onSubmit, isSubmitting } = props;
    const schema = mode === 'create' ? createBoardSchema : updateBoardSchema;

    const { register, handleSubmit, formState: { errors } } = useForm<CreateBoardInput | UpdateBoardInput>({
        resolver: zodResolver(schema),
        defaultValues: mode === 'edit'
            ? { title: props.initialData.title, description: props.initialData.description ?? undefined }
            : undefined,
    });

    const submit = handleSubmit((data) => (onSubmit as (d: CreateBoardInput | UpdateBoardInput) => void)(data));

    return (
        <form onSubmit={submit} noValidate className="flex flex-col h-full">
            <div className="space-y-4 flex-1">
                <Field label="Title" error={errors.title?.message}>
                    <Input {...register('title')} placeholder="Enter a title" />
                </Field>

                <Field label="Description (Optional)" error={errors.description?.message}>
                    <Textarea rows={3} {...register('description')} placeholder="Enter a short description" />
                </Field>
            </div>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

const TaskForm = (props: Extract<EntityModalProps, { entityType: 'task' }>) => {

    const { mode, onClose, onSubmit, isSubmitting } = props;

    const schema = mode === 'create' ? createTaskSchema : updateTaskSchema;
    const onDelete = mode === 'edit' ? props.onDelete : undefined;
    const isDeleting = mode === 'edit' ? props.isDeleting : undefined;

    const taskIcons = {
        DEV: '/dev.svg',
        CHAT: '/chat.svg',
        COFFEE: '/coffee.svg',
        GYM: '/gym.svg',
        BOOKS: '/books.svg',
        CLOCK: '/clock.svg'
    }

    const taskStatusColors = {
        IN_PROGRESS: 'bg-yellow-400',
        COMPLETED: 'bg-green-400',
        WONT_DO: 'bg-red-400',
    }

    const taskStatusLabel = {
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed",
        WONT_DO: "Won't do"
    }

    const taskStatusIcon = {
        IN_PROGRESS: '/time_attack_duotone.svg',
        COMPLETED: '/done_round_duotone.svg',
        WONT_DO: '/close_ring_duotone.svg',
    }

    const { register, control, handleSubmit, formState: { errors } } = useForm<CreateTaskInput | UpdateTaskInput>({
        resolver: zodResolver(schema),
        defaultValues: mode === 'edit'
            ? {
                name: mode === 'edit' ? props.initialData.name : '',
                description: mode === 'edit' ? (props.initialData.description ?? undefined) : undefined,
                status: mode === 'edit' ? props.initialData.status : 'IN_PROGRESS',
                icon: mode === 'edit' ? (props.initialData.icon as CreateTaskInput['icon']) : ('' as CreateTaskInput['icon']),
            }
            : undefined,
    });

    const submit = handleSubmit((data) => (onSubmit as (d: CreateTaskInput | UpdateTaskInput) => void)(data));

    return (
        <form onSubmit={submit} noValidate className="space-y-4">
            <Field label="Name" error={errors.name?.message}>
                <Input {...register('name')} placeholder="Enter a task name" />
            </Field>

            <Field label="Description (Optional)" error={errors.description?.message}>
                <Textarea rows={3} {...register('description')} />
            </Field>

            {/* Icon Selector */}
            <Field label="Icon" error={errors.icon?.message}>
                <Controller
                    name="icon"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            className="flex flex-wrap gap-3"
                        >
                            {(Object.keys(taskIcons) as (keyof typeof taskIcons)[]).map((key) => (
                                <Label
                                    key={key}
                                    htmlFor={`icon-${key}`}
                                    className="relative flex size-14 items-center justify-center rounded-lg border border-input cursor-pointer has-data-[state=checked]:border-amber-200 has-data-[state=checked]:bg-amber-500/10 transition-colors"
                                >
                                    <RadioGroupItem
                                        value={key}
                                        id={`icon-${key}`}
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                    />
                                    <img
                                        src={taskIcons[key]}
                                        alt={key}
                                        width={20}
                                        height={20}
                                    />
                                </Label>
                            ))}
                        </RadioGroup>
                    )}
                />
            </Field>

            {/* Status Selector */}
            <Field label="Status" error={errors.status?.message}>
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value ?? ''}
                            onValueChange={field.onChange}
                            className="grid sm:grid-cols-2 gap-3"
                        >
                            {(Object.keys(taskStatusLabel) as (keyof typeof taskStatusLabel)[]).map((status) => (
                                <Label
                                    key={status}
                                    htmlFor={`status-${status}`}
                                    className="relative flex h-12 items-center justify-center rounded-lg border-2 border-input cursor-pointer has-data-[state=checked]:border-[#3662E3] transition-colors"
                                >
                                    <RadioGroupItem
                                        value={status}
                                        id={`status-${status}`}
                                        className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                                    />
                                    <div
                                        className={cn(
                                            "flex items-center justify-center absolute left-0.5 rounded-lg h-10 w-10",
                                            taskStatusColors[status]
                                        )}
                                    >
                                        <img
                                            src={taskStatusIcon[status]}
                                            alt={status}
                                            width={20}
                                            height={20}
                                        />
                                    </div>
                                    <p className="">{taskStatusLabel[status]}</p>
                                </Label>
                            ))}
                        </RadioGroup>
                    )}
                />
            </Field>

            <DialogFooter>
                {onDelete ? (
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-rust hover:text-rust hover:bg-rust/10"
                        disabled={isDeleting}
                        onClick={onDelete}
                    >
                        {isDeleting ? 'Deleting…' : 'Delete task'}
                    </Button>
                ) : (
                    <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => {
    return (
        <div>
            <label className="block mb-1.5 text-sm tracking-wide text-muted-foreground">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
}