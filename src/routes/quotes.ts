import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import { QuoteService } from '../services/QuoteService';
import { authenticateToken } from '../middleware/auth';

export function createQuoteRoutes(dbService: DatabaseService): Router {
  const router = Router();
  const quoteService = new QuoteService(dbService.getPrisma());

  // GET /api/quotes
  router.get('/',

 authenticateToken, async (req, res) => {
    try {
      const organizationId = req.user.organizationId;
      const quotes = await quoteService.getQuotes(organizationId);
      res.json(quotes);
    } catch (error) {
      console.error('Get quotes error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/quotes/:id
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const quote = await quoteService.getQuoteById(id);
      
      if (!quote) {
        return res.status(404).json({ error: 'Quote not found' });
      }
      
      res.json(quote);
    } catch (error) {
      console.error('Get quote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/quotes
  router.post('/', authenticateToken, async (req, res) => {
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

      // Add line items if provided
      if (lineItems && lineItems.length > 0) {
        let totalQuantity = 0;
        let totalAmount = 0;

        for (const item of lineItems) {
          const lineItem = await quoteService.addLineItem(quote.id, item);
          totalQuantity += lineItem.quantity;
          totalAmount += lineItem.total;
        }

        // Update quote totals
        await quoteService.updateQuote(quote.id, {
          totalQuantity,
          totalAmount
        });
      }

      res.status(201).json(quote);
    } catch (error) {
      console.error('Create quote error:', error);
      res.status(

500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/quotes/:id
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const quote = await quoteService.updateQuote(id, updateData);
      res.json(quote);
    } catch (error) {
      console.error('Update quote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/quotes/:id/send
  router.post('/:id/send', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const quote = await quoteService.sendQuote(id);
      
      // TODO: Send email notification to customer
      // await emailService.sendQuoteEmail(quote);
      
      res.json({ message: 'Quote sent successfully', quote });
    } catch (error) {
      console.error('Send quote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/quotes/:id/approve


  router.post('/:id/approve', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const approvedBy = req.user.userId;
      
      const quote = await quoteService.approveQuote(id, approvedBy);
      
      // TODO: Create invoice draft automatically
      // await invoiceService.createInvoiceFromQuote(quote);
      
      res.json({ message: 'Quote approved successfully', quote });
    } catch (error) {
      console.error('Approve quote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/quotes/:id/reject
  router.post('/:id/reject', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const quote = await quoteService.rejectQuote(id);
      
      res.json({ message: 'Quote rejected', quote });
    } catch (error) {
      console.error('Reject quote error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/quotes/:id/line-items


  router.post('/:id/line-items', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const itemData = req.body;

      const lineItem = await quoteService.addLineItem(id, itemData);
      res.status(201).json(lineItem);
    } catch (error) {
      console.error('Add line item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/quotes/line-items/:id
  router.put('/line-items/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const itemData = req.body;

      const lineItem = await quoteService.updateLineItem(id, itemData);
      res.json(lineItem);
    } catch (error) {
      console.error('Update line item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/quotes/line-items/:id
  router.delete('/line-items/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await quote

Service.deleteLineItem(id);
      res.json({ message: 'Line item deleted successfully' });
    } catch (error) {
      console.error('Delete line item error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}