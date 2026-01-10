"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerRoutes = createCustomerRoutes;
const express_1 = require("express");
const CustomerService_1 = require("../services/CustomerService");
const auth_1 = require("../middleware/auth");
function createCustomerRoutes(dbService) {
    const router = (0, express_1.Router)();
    const customerService = new CustomerService_1.CustomerService(dbService.getPrisma());
    router.get('/', auth_1.authenticateToken, async (req, res) => {
        try {
            const organizationId = req.user.organizationId;
            const customers = await customerService.getCustomers(organizationId);
            res.json(customers);
        }
        catch (error) {
            console.error('Get customers error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const customer = await customerService.getCustomerById(id);
            if (!customer) {
                return res.status(404).json({ error: 'Customer not found' });
            }
            res.json(customer);
        }
        catch (error) {
            console.error('Get customer error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/', auth_1.authenticateToken, async (req, res) => {
        try {
            const { companyName, accountNumber, notes, planTier, contacts } = req.body;
            const organizationId = req.user.organizationId;
            const customer = await customerService.createCustomer({
                organizationId,
                companyName,
                accountNumber,
                notes,
                planTier
            });
            if (contacts && contacts.length > 0) {
                for (const contact of contacts) {
                    await customerService.addContact(customer.id, contact);
                }
            }
            res.status(201).json(customer);
        }
        catch (error) {
            console.error('Create customer error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const customer = await customerService.updateCustomer(id, updateData);
            res.json(customer);
        }
        catch (error) {
            console.error('Update customer error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            await customerService.deleteCustomer(id);
            res.json({ message: 'Customer deleted successfully' });
        }
        catch (error) {
            console.error('Delete customer error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.post('/:id/contacts', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const contactData = req.body;
            const contact = await customerService.addContact(id, contactData);
            res.status(201).json(contact);
        }
        catch (error) {
            console.error('Add contact error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.put('/contacts/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            const contactData = req.body;
            const contact = await customerService.updateContact(id, contactData);
            res.json(contact);
        }
        catch (error) {
            console.error('Update contact error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.delete('/contacts/:id', auth_1.authenticateToken, async (req, res) => {
        try {
            const { id } = req.params;
            await customerService.deleteContact(id);
            res.json({ message: 'Contact deleted successfully' });
        }
        catch (error) {
            console.error('Delete contact error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=customers.js.map