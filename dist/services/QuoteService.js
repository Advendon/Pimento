"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteService = void 0;
const models_1 = require("../models");
class QuoteService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createQuote(data) {
        return this.prisma.quote.create({ data });
    }
    async getQuotes(organizationId) {
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
    async getQuoteById(id) {
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
    async updateQuote(id, data) {
        return this.prisma.quote.update({
            where: { id },
            data
        });
    }
    Item(quoteId, itemData) {
        return this.prisma.quoteLineItem.create({
            data: { ...itemData, quoteId }
        });
    }
    async updateLineItem(id, itemData) {
        return this.prisma.quoteLineItem.update({
            where: { id },
            data: itemData
        });
    }
    async deleteLineItem(id) {
        return this.prisma.quoteLineItem.delete({ where: { id } });
    }
    async sendQuote(id) {
        return this.prisma.quote.update({
            where: { id },
            data: { status: models_1.QuoteStatus.APPROVAL_SENT }
        });
    }
    async approveQuote(id, approvedBy) {
        return this.prisma.quote.update({
            where: { id },
            data: {
                status: models_1.QuoteStatus.APPROVED,
                approvedBy,
                approvedAt: new Date()
            }
        });
    }
    async rejectQuote(id) {
        return this.prisma.quote.update({
            where: { id },
            data: { status: models_1.QuoteStatus.ON_HOLD }
        });
    }
}
exports.QuoteService = QuoteService;
//# sourceMappingURL=QuoteService.js.map