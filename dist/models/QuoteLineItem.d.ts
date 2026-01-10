export interface QuoteLineItem {
    id: string;
    quoteId: string;
    category: string;
    moduleType: string;
    itemCode?: string;
    description?: string;
    color?: string;
    sizeBreakdown?: Record<string, number>;
    quantity: number;
    unitPrice: number;
    markupPct: number;
    tax: number;
    total: number;
    productionInstructions?: string;
    attachments?: Record<string, any>[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=QuoteLineItem.d.ts.map