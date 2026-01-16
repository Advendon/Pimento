import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import { authenticateToken } from '../../Middleware/auth';
import { createOrderRoutes } from './orders';

export function createRoutes(dbService: DatabaseService): Router {
  const router = Router();

  // Health check
  router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  // Get all customers
  router.get('/customers', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const customers = await prisma.customer.findMany({
        include: {
          contacts: true,
          quotes: {
            include: {
              lineItems: true
            }
          }
        }
      });
      res.json(customers);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Get all quotes
  router.get('/quotes', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const quotes = await prisma.quote.findMany({
        include: {
          customer: true,
          lineItems: true,
          creator: true
        }
      });
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Get all machines
  router.get('/machines', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const machines = await prisma.machine.findMany({
        include: {
          costingRecords: true
        }
      });
      res.json(machines);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Get all users
  router.get('/users', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Create a new customer
  router.post('/customers', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const { companyName, accountNumber, notes, contacts } = req.body;
      
      const customer = await prisma.customer.create({
        data: {
          organizationId: req.body.organizationId || '00000000-0000-0000-0000-000000000000',
          companyName,
          accountNumber,
          notes,
          contacts: contacts ? {
            create: contacts
          } : undefined
        },
        include: {
          contacts: true
        }
      });
      
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Create a new quote
  router.post('/quotes', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const { 
        organizationId, 
        customerId, 
        quoteNumber, 
        productionDue, 
        customerDue, 
        productionNotes, 
        createdBy,
        lineItems 
      } = req.body;

      const quote = await prisma.quote.create({
        data: {
          organizationId,
          customerId,
          quoteNumber,
          productionDue: productionDue ? new Date(productionDue) : null,
          customerDue: customerDue ? new Date(customerDue) : null,
          productionNotes,
          createdBy,
          lineItems: lineItems ? {
            create: lineItems
          } : undefined
        },
        include: {
          customer: true,
          lineItems: true,
          creator: true
        }
      });
      
      res.status(201).json(quote);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  });

  // Order routes
  const orderRoutes = createOrderRoutes(dbService);
  router.use('/orders', orderRoutes);

  // Get current user
  router.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { 
          id: true, 
          email: true, 
          name: true, 
          role: true, 
          settings: true,
          organizationId: true 
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });

  // Update user settings
  router.put('/api/users/settings', authenticateToken, async (req, res) => {
    try {
      const { settings } = req.body;
      const userId = req.user.userId;
      const prisma = dbService.getPrisma();

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { settings },
        select: { id: true, settings: true }
      });

      res.json(updatedUser);
    } catch (error) {
      console.error('Update settings error:', error);
      res.status(500).json({ error: 'Failed to update settings' });
    }
  });

  return router;
}