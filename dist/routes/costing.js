"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCostingRoutes = createCostingRoutes;
const express_1 = require("express");
const CostingService_1 = require("../services/CostingService");
const auth_1 = require("../middleware/auth");
function createCostingRoutes(dbService) {
    const router = (0, express_1.Router)();
    const costingService = new CostingService_1.CostingService(dbService.getPrisma());
    router.post('/calculate', auth_1.authenticateToken, async (req, res) => {
        try {
            const costingInput = req.body;
            const result = await costingService.calculateCost(costingInput);
            res.json(result);
        }
        catch (error) {
            console.error('Costing calculation error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/history/:machineId', auth_1.authenticateToken, async (req, res) => {
        try {
            const { machineId } = req.params;
            const { limit = 50 } = req.query;
            const history = await costingService.getCostingHistory(machineId, Number(limit));
            res.json(history);
        }
        catch (error) {
            console.error('Get costing history error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    router.get('/average/:machineId', auth_1.authenticateToken, async (req, res) => {
        try {
            const { machineId } = req.params;
            const { days = 30 } = req.query;
            const average = await costingService.getAverageCostPerSqmm(machineId, Number(days));
            res.json({ averageCostPerSqmm: average });
        }
        catch (error) {
            console.error('Get average cost error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    return router;
}
//# sourceMappingURL=costing.js.map