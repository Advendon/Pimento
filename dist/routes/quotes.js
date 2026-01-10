"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuoteRoutes = createQuoteRoutes;
const express_1 = require("express");
const QuoteService_1 = require("../services/QuoteService");
const auth_1 = require("../middleware/auth");
function createQuoteRoutes(dbService) {
    const router = (0, express_1.Router)();
    const quoteService = new QuoteService_1.QuoteService(dbService.getPrisma());
    router.get('/', auth_1.authenticateToken, async (req, res) => {
        try {
            const organizationId = req.user.organizationId;
            const quotes = await quoteService.getQuotes(organizationId);
            res.json(quotes);
        }
        catch (error) {
            console.error('Get quotes error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await quoteService.getQuoteById(id);
            if (!quote) {
                return res.status(404).json({ error: 'Quote not found' });
            }
            res.json(quote);
        }
        catch (error) {
            console.error('Get quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/', auth_1.authenticateToken, async (req, res) => {
        try {
            const { customerId, quoteNumber, productionDueDate, customerDueDate, productionNotes, lineItems } = req.body;
            const organizationId = req.user.organizationId;
            const createdBy = req.user.userId;
            const quote = await quoteService.createQuote({
                organizationId,
                customerId,
                quoteNumber,
                productionDueDate,
                customerDueDate,
                productionNotes,
                status: 'draft',
                createdBy,
                totalQuantity: 0,
                totalAmount: 0
            });
            if (lineItems && lineItems.length > 0) {
                let totalQuantity = 0;
                let totalAmount = 0;
                for (const item of lineItems) {
                    const lineItem = await quoteService.addLineItem(quote.id, item);
                    totalQuantity += lineItem.quantity;
                    totalAmount += lineItem.total;
                }
                await quoteService.updateQuote(quote.id, {
                    totalQuantity,
                    totalAmount
                });
            }
            res.status(201).json(quote);
        }
        catch (error) {
            console.error('Create quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const quote = await quoteService.updateQuote(id, updateData);
            res.json(quote);
        }
        catch (error) {
            console.error('Update quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/send', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await quoteService.sendQuote(id);
            res.json({ message: 'Quote sent successfully', quote });
        }
        catch (error) {
            console.error('Send quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/approve', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const approvedBy = req.user.userId;
            const quote = await quoteService.approveQuote(id, approvedBy);
            res.json({ message: 'Quote approved successfully', quote });
        }
        catch (error) {
            console.error('Approve quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/reject', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const quote = await quoteService.rejectQuote(id);
            res.json({ message: 'Quote rejected', quote });
        }
        catch (error) {
            console.error('Reject quote error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/line-items', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const itemData = req.body;
            const lineItem = await quoteService.addLineItem(id, itemData);
            res.status(201).json(lineItem);
        }
        catch (error) {
            console.error('Add line item error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/line-items/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const itemData = req.body;
            const lineItem = await quoteService.updateLineItem(id, itemData);
            res.json(lineItem);
        }
        catch (error) {
            console.error('Update line item error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/line-items/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            await quote;
            Service.deleteLineItem(id);
            res.json({ message: 'Line item deleted successfully' });
        }
        catch (error) {
            console.error('Delete line item error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=quotes.js.map