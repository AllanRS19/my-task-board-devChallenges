// src/components/EntityModal.tsx
import { useForm } from "react-hook-form";
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
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
import {
    createBoardSchema,
    updateBoardSchema,
    type CreateBoardInput,
    type UpdateBoardInput,
} from "@/schemas/board.schema";
// import {
//     createTaskSchema,
//     updateTaskSchema,
//     type CreateTaskInput,
//     type UpdateTaskInput,
// } from "@/schemas/task.schema";
import type { Board } from "@/api/boards";
// import type { Task } from "@/api/tasks";

type EntityModalProps =
    | { entityType: 'board'; mode: 'create'; isOpen: boolean; onClose: () => void; onSubmit: (data: CreateBoardInput) => void; isSubmitting?: boolean }
    | { entityType: 'board'; mode: 'edit'; isOpen: boolean; onClose: () => void; onSubmit: (data: UpdateBoardInput) => void; isSubmitting?: boolean; initialData: Board }
// | { entityType: 'task'; mode: 'create'; isOpen: boolean; onClose: () => void; onSubmit: (data: CreateTaskInput) => void; isSubmitting?: boolean }
// | { entityType: 'task'; mode: 'edit'; isOpen: boolean; onClose: () => void; onSubmit: (data: UpdateTaskInput) => void; isSubmitting?: boolean; initialData: Task };

export function EntityModal(props: EntityModalProps) {
    const { isOpen, onClose, entityType, mode } = props;

    const title =
        entityType === 'board'
            ? mode === 'create' ? 'Create a new board' : 'Edit board'
            : mode === 'create' ? 'Add a new task' : 'Edit task';

    const formKey = `${entityType}-${mode}-${mode === 'edit' ? props.initialData.id : 'new'}`;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {entityType === 'board' ? (
                    <BoardForm key={formKey} {...props} />
                ) : (
                    // Pending to implement
                    // <TaskForm key={formKey} {...props} />
                    <p>Here goes the task form</p>
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
        <form onSubmit={submit} noValidate className="space-y-4">
            <Field label="Title" error={errors.title?.message}>
                <Input {...register('title')} />
            </Field>

            <Field label="Description (Optional)" error={errors.description?.message}>
                <Textarea rows={3} {...register('description')} />
            </Field>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

// const TaskForm = (props: Extract<EntityModalProps, { entityType: 'task' }>) => {
//     const { mode, onClose, onSubmit, isSubmitting } = props;
//     const schema = mode === 'create' ? createTaskSchema : updateTaskSchema;

//     const { register, control, handleSubmit, formState: { errors } } = useForm<CreateTaskInput | UpdateTaskInput>({
//         resolver: zodResolver(schema),
//         defaultValues: mode === 'edit'
//             ? {
//                 name: props.initialData.name,
//                 description: props.initialData.description ?? undefined,
//                 status: props.initialData.status,
//                 icon: props.initialData.icon as CreateTaskInput['icon'],
//             }
//             : undefined,
//     });

//     const submit = handleSubmit((data) => (onSubmit as (d: CreateTaskInput | UpdateTaskInput) => void)(data));

//     return (
//         <form onSubmit={submit} noValidate className="space-y-4">
//             <Field label="Name" error={errors.name?.message}>
//                 <Input {...register('name')} />
//             </Field>

//             <Field label="Description" error={errors.description?.message}>
//                 <Textarea rows={3} {...register('description')} />
//             </Field>

//             <Field label="Status" error={errors.status?.message}>
//                 <Controller
//                     name="status"
//                     control={control}
//                     render={({ field }) => (
//                         <Select value={field.value} onValueChange={field.onChange}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="IN_PROGRESS">In progress</SelectItem>
//                                 <SelectItem value="COMPLETED">Completed</SelectItem>
//                                 <SelectItem value="WONT_DO">Won't do</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     )}
//                 />
//             </Field>

//             <Field label="Icon" error={errors.icon?.message}>
//                 <Controller
//                     name="icon"
//                     control={control}
//                     render={({ field }) => (
//                         <Select value={field.value} onValueChange={field.onChange}>
//                             <SelectTrigger>
//                                 <SelectValue placeholder="Select icon" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="in_progress">In progress</SelectItem>
//                                 <SelectItem value="completed">Completed</SelectItem>
//                                 <SelectItem value="wont_do">Won't do</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     )}
//                 />
//             </Field>

//             <DialogFooter>
//                 <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                     {isSubmitting ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
//                 </Button>
//             </DialogFooter>
//         </form>
//     );
// }

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => {
    return (
        <div>
            <label className="block mb-1.5 text-xs font-medium tracking-wide uppercase text-muted-foreground">
                {label}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
        </div>
    );
}