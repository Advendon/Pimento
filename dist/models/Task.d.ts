export interface Task {
    id: string;
    organizationId: string;
    title: string;
    description?: string;
    assigneeId?: string;
    dueDate?: Date;
    status: TaskStatus;
    relatedType?: string;
    relatedId?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
//# sourceMappingURL=Task.d.ts.map