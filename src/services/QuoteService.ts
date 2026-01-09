

import { PrismaClient } from '@prisma/client';
import { Quote, QuoteLineItem, QuoteStatus } from '../models';

export class QuoteService {
  constructor(private prisma: PrismaClient) {}

  async createQuote(data: Partial<Quote>): Promise<Quote> {
    return this.prisma.quote.create({ data });
  }

  async getQuotes(organizationId: string): Promise<Quote[]> {
    return this.prisma.quote.findMany({
      where: { organizationId },
      include: { 
        customer: true, 
        lineItems: true,
        creator: true,
        approver: true 
      }
    });
  }

  async getQuoteById(id: string): Promise<Quote | null> {
    return this.prisma.quote.findUnique({
      where: { id },
      include: { 
        customer: true,
        lineItems: true,
        creator: true,
        approver: true,
        organization: true
      }
    });
  }

  async updateQuote(id: string, data: Partial<Quote>): Promise<Quote> {
    return this.prisma.quote.update({
      where: { id },
      data
    });
  }

  async addLine

Item(quoteId: string, itemData: Partial<QuoteLineItem>): Promise<QuoteLineItem> {
    return this.prisma.quoteLineItem.create({
      data: { ...itemData, quoteId }
    });
  }

  async updateLineItem(id: string, itemData: Partial<QuoteLineItem>): Promise<QuoteLineItem> {
    return this.prisma.quoteLineItem.update({
      where: { id },
      data: itemData
    });
  }

  async deleteLineItem(id: string): Promise<QuoteLineItem> {
    return this.prisma.quoteLineItem.delete({ where: { id });
  }

  async sendQuote(id: string): Promise<Quote> {
    return this.prisma.quote.update({
      where: { id },
      data: { status: QuoteStatus.APPROVAL_SENT }
    });
  }

  async approveQuote(id: string, approvedBy: string): Promise<Quote> {
    return this.prisma.quote.update({
      where: { id },
      data: { 
        status: QuoteStatus.APPROVED,
        approvedBy,
        approvedAt: new Date()
      }
    });
  }

  async rejectQuote(id: string): Promise<Quote> {
    return this.prisma.quote.update({
     

 where: { id },
      data: { status: QuoteStatus.ON_HOLD }
    });
  }
}