import { CostingService } from '../CostingService';


import { PrismaClient } from '@prisma/client';

describe('CostingService', () => {
  let costingService: CostingService;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    costingService = new CostingService(prisma);
  });

  describe('calculateCost', () => {
    it('should calculate basic job cost correctly', async () => {
      const mockMachine = {
        id: 'machine-1',
        purchasePrice: 50000,
        usefulLifeYears: 5,
        powerKw: 2.5,
        insuranceCostYr: 1200
      };

      jest.spyOn(prisma.machine, 'findUnique').mockResolvedValue(mockMachine as any);
      jest.spyOn(prisma.costingRecord, 'create').mockResolvedValue({} as any);

      const input = {
        machineId: 'machine-1',
        jobAreaSqmm: 1000000, // 1 sq meter
        consumablesList: [
          { consumableId: 'ink-1', qtyUsed: 100, costPerUnit: 0.5 },
          { consumableId: 'substrate-1', qtyUsed: 1, costPerUnit: 10 }
        ],
        runTimeHours: 2,
        operatorTime

Hours: 2,
        overheadAllocations: {
          facilityCostPerMonth: 5000,
          adminCosts: 2000,
          productionCountPerMonth: 100
        }
      };

      const result = await costingService.calculateCost(input);

      expect(result.totalCost).toBeGreaterThan(0);
      expect(result.costPerSqmm).toBeGreaterThan(0);
      expect(result.recommendedPrice).toBeGreaterThan(result.totalCost);
      expect(result.breakdown.consumablesCost).toBe(60); // 100*0.5 + 1*10
    });

    it('should handle waste percentage correctly', async () => {
      const mockMachine = {
        id: 'machine-1',
        purchasePrice: 50000,
        usefulLifeYears: 5,
        powerKw: 2.5,
        insuranceCostYr: 1200
      };

      jest.spyOn(prisma.machine, 'findUnique').mockResolvedValue(mockMachine as any);
      jest.spyOn(prisma.costingRecord, 'create').mockResolvedValue({} as any);

      const input = {
        machineId: 'machine-1',
        jobAreaSqmm: 1000000,
        consumablesList: [{ consumableId: '

ink-1', qtyUsed: 100, costPerUnit: 0.5 }],
        runTimeHours: 1,
        operatorTimeHours: 1,
        wastePct: 0.1 // 10% waste
      };

      const result = await costingService.calculateCost(input);

      expect(result.breakdown.wasteCost).toBe(5); // 10% of 50
    });

    it('should calculate sensitivity analysis correctly', async () => {
      const mockMachine = {
        id: 'machine-1',
        purchasePrice: 50000,
        usefulLifeYears: 5,
        powerKw: 2.5,
        insuranceCostYr: 1200
      };

      jest.spyOn(prisma.machine, 'findUnique').mockResolvedValue(mockMachine as any);
      jest.spyOn(prisma.costingRecord, 'create').mockResolvedValue({} as any);

      const input = {
        machineId: 'machine-1',
        jobAreaSqmm: 1000000,
        consumablesList: [{ consumableId: 'ink-1', qtyUsed: 100, costPerUnit: 0.5 }],
        runTimeHours: 1,
        operatorTimeHours: 1
      };

      const result = await costingService.calculateCost(input);

      expect(result.sensitivity

Analysis.powerRateImpact).toBeGreaterThan(0);
      expect(result.sensitivityAnalysis.consumableCostImpact).toBeGreaterThan(0);
    });
  });

  describe('getAverageCostPerSqmm', () => {
    it('should calculate average cost correctly', async () => {
      jest.spyOn(prisma.costingRecord, 'aggregate').mockResolvedValue({
        _avg: { costPerSqmm: 0.15 }
      } as any);

      const average = await costingService.getAverageCostPerSqmm('machine-1', 30);
      
      expect(average).toBe(0.15);
    });
  });
});