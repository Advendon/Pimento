import { PrismaClient } from '@prisma/client';
import { Quote, QuoteLineItem } from '../models';
export declare class QuoteService {
    private prisma;
    constructor(prisma: PrismaClient);
    createQuote(data: Partial<Quote>): Promise<Quote>;
    getQuotes(organizationId: string): Promise<Quote[]>;
    getQuoteById(id: string): Promise<Quote | null>;
    updateQuote(id: string, data: Partial<Quote>): Promise<Quote>;
    addLine: any;
    Item(quoteId: string, itemData: Partial<QuoteLineItem>): Promise<QuoteLineItem>;
    updateLineItem(id: string, itemData: Partial<QuoteLineItem>): Promise<QuoteLineItem>;
    deleteLineItem(id: string): Promise<QuoteLineItem>;
    sendQuote(id: string): Promise<Quote>;
    approveQuote(id: string, approvedBy: string): Promise<Quote>;
    rejectQuote(id: string): Promise<Quote>;
}
//# sourceMappingURL=QuoteService.d.ts.map