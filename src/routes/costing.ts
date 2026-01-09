import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';
import { CostingService } from '../services/CostingService';
import { authenticateToken } from '../middleware/auth';

export function createCostingRoutes(dbService: DatabaseService): Router {
  const router = Router();
  const costingService = new CostingService(dbService.getPrisma());

  // POST /api/costing/calculate
  router.post('/calculate', authenticateToken, async (req, res) => {
    try {
      const costingInput = req.body;
      const result = await costingService.calculateCost(costingInput);
      res.json(result);
    } catch (error) {
      console.error('Costing calculation error:', error);
     

 res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/costing/history/:machineId
  router.get('/history/:machineId', authenticateToken, async (req, res) => {
    try {
      const { machineId } = req.params;
      const { limit = 50 } = req.query;
      
      const history = await costingService.getCostingHistory(machineId, Number(limit));
      res.json(history);
    } catch (error) {
      console.error('Get costing history error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/costing/average/:machineId
  router.get('/average/:machineId', authenticateToken, async (req, res) => {
    try {
      const { machineId } = req.params;
      const { days = 30 } = req.query;
      
      const average = await costingService.getAverageCostPerSqmm(machineId, Number(days));
      res.json({ averageCostPerSqmm: average });
    } catch (error) {
      console.error('Get average cost error:', error);
      res.status(500).json({ error:

 'Internal server error' });
    }
  });

  return router;
}