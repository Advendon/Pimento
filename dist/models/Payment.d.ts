export interface Payment {
    id: string;
    organizationId: string;
    invoiceId: string;
    amount: number;
    method: PaymentMethod;
    providerReference?: string;
    status: Payment;
    Status: any;
    paidAt?: Date;
    createdAt: Date;
}
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    BANK_TRANSFER = "bank_transfer",
    CASH = "cash",
    CHECK = "check",
    STRIPE = "stripe"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded"
}
//# sourceMappingURL=Payment.d.ts.map