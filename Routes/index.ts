import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import { createAuthRoutes } from './auth';
import { createCustomerRoutes } from './customers';
import { createQuoteRoutes } from './quotes';
import { createCostingRoutes } from './costing';

export function createRoutes(dbService: DatabaseService): Router {
  const router = Router();

  // Mount route modules
  router.use('/auth', createAuthRoutes(dbService));
  router.use('/customers', createCustomerRoutes(dbService));
  router.use('/quotes', createQuote

Routes(dbService));
  router.use('/costing', createCostingRoutes(dbService));

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });

  return router;
}