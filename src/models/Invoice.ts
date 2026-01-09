export interface Invoice {
  id: string;
  organizationId: string;
  customerId: string;
  invoiceNumber: string;
  sourceQuoteId?: string;
  status: InvoiceStatus;
  dueDate: Date;
  totalAmount: number;
  tax: number;
  paymentsApplied?: Record<string, any>[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  OVERDUE = 'overdue'
}