export interface Notification {
    id: string;
    organizationId: string;
    userId: string;
    type: NotificationType;
    payload: Record<string, any>;
    readAt?: Date;
    createdAt: Date;
}
export declare enum NotificationType {
    QUOTE_APPROVED = "quote_approved",
    QUOTE_REJECTED = "quote_rejected",
    INVOICE_PAID = "invoice_paid",
    INVOICE_OVERDUE = "invoice_overdue",
    ORDER_SCHEDULED = "order_scheduled",
    ORDER_COMPLETED = "order_completed",
    MAINTENANCE_DUE = "maintenance_due",
    LOW_STOCK = "low_stock",
    TASK_ASSIGNED = "task_assigned"
}
//# sourceMappingURL=Notification.d.ts.map