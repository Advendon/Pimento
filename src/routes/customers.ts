import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import { CustomerService } from '../services/CustomerService';
import { authenticateToken } from '../middleware/auth';

export function createCustomerRoutes(dbService: DatabaseService): Router {
  const router = Router();
  const customerService = new CustomerService(dbService.getPrisma());

  // GET /api/customers
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const organizationId = req.user.organizationId; // Assuming user has organization
      const customers = await customerService.getCustomers(organizationId);
     

 res.json(customers);
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/customers/:id
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(id);
      
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      
      res.json(customer);
    } catch (error) {
      console.error('Get customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/customers
  router.post('/', authenticateToken, async (req, res) => {
    try {
      const { companyName, accountNumber, notes, planTier, contacts } = req.body;
      const organizationId = req.user.organizationId;

      const customer = await customerService.createCustomer({
        organizationId,
        companyName,
        accountNumber

,
        notes,
        planTier
      });

      // Add contacts if provided
      if (contacts && contacts.length > 0) {
        for (const contact of contacts) {
          await customerService.addContact(customer.id, contact);
        }
      }

      res.status(201).json(customer);
    } catch (error) {
      console.error('Create customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/customers/:id
  router.put('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const customer = await customerService.updateCustomer(id, updateData);
      res.json(customer);
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/customers/:id
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await

 customerService.deleteCustomer(id);
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Delete customer error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/customers/:id/contacts
  router.post('/:id/contacts', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const contactData = req.body;

      const contact = await customerService.addContact(id, contactData);
      res.status(201).json(contact);
    } catch (error) {
      console.error('Add contact error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT /api/customers/contacts/:id
  router.put('/contacts/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      const contactData = req.body;

      const contact = await customerService.updateContact(id, contactData);
      res.json(contact);
    } catch (error) {
     

 console.error('Update contact error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE /api/customers/contacts/:id
  router.delete('/contacts/:id', authenticateToken, async (req, res) => {
    try {
      const { id } = req.params;
      await customerService.deleteContact(id);
      res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Delete contact error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}