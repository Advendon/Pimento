import { PrismaClient } from '@prisma/client';
import { Machine, Consumable, CostingRecord } from '../models';

export interface CostingInput {
  machineId: string;
  jobAreaSqmm: number;
  consumablesList: Array<{
    consumableId: string;
    qtyUsed: number;
    costPerUnit: number;
  }>;
  substrateAreaSqmm?: number;
  substrateCost?: number;
  runTimeHours: number;
  idleTimeHours?: number;
  operatorTimeHours: number;
  overheadAllocations?: {
    facilityCostPerMonth: number;
    adminCosts: number;
    productionCountPerMonth: number;
  };
  wastePct?: number;
  reworkEstimateCost?: number;
  softwareLicenseYr?: number;
  environmentalFees?: number;
  extras?: number;
}

export interface CostingOutput {
  breakdown: {
    depreciationCost: number;
    replacementSavings: number;
    maintenanceSavings: number;
    printheadSavings: number;
    insuranceCostAllocated: number;


    consumablesCost: number;
    substrateCost: number;
    adhesivesCost: number;
    cleaningSuppliesCost: number;
    wasteCost: number;
    powerCost: number;
    laborCost: number;
    overheadCost: number;
    wearAndTearCost: number;
    softwareCost: number;
    reworkCost: number;
    miscCost: number;
  };
  totalCost: number;
  costPerSqmm: number;
  recommendedPrice: number;
  sensitivityAnalysis: {
    powerRateImpact: number;
    consumableCostImpact: number;
  };
  auditTrace: CostingInput & { calculatedAt: Date };
}

export class CostingService {
  constructor(private prisma: PrismaClient) {}

  async calculateCost(input: CostingInput): Promise<CostingOutput> {
    const machine = await this.prisma.machine.findUnique({
      where: { id: input.machineId }
    });

    if (!machine) {
      throw new Error('Machine not found');
    }

    // Calculate each cost component
    const depreciationCost = this.calculateDepreciation(
      machine.purchasePrice || 0,
      machine.usefulLifeYears || 5

,
      input.jobAreaSqmm
    );

    const powerCost = this.calculatePowerCost(
      machine.powerKw || 0,
      input.runTimeHours,
      0.12 // $/kWh - should be configurable
    );

    const laborCost = this.calculateLaborCost(
      input.operatorTimeHours,
      25 // $/hour - should be configurable
    );

    const consumablesCost = input.consumablesList.reduce(
      (total, item) => total + (item.qtyUsed * item.costPerUnit),
      0
    );

    const overheadCost = this.calculateOverheadCost(
      input.overheadAllocations,
      input.jobAreaSqmm
    );

    const wasteCost = this.calculateWasteCost(
      consumablesCost + (input.substrateCost || 0),
      input.wastePct || 0.05
    );

    const totalCost = depreciationCost + powerCost + laborCost + 
                     consumablesCost + overheadCost + wasteCost +
                     (input.reworkEstimateCost || 0) + (input.environmentalFees || 0) + 
                     (input.extras || 0);

    const costPerSqmm = totalCost / input.job

AreaSqmm;

    const recommendedPrice = this.calculateRecommendedPrice(
      totalCost,
      0.3 // 30% markup - should be configurable
    );

    // Save costing record
    await this.prisma.costingRecord.create({
      data: {
        machineId: input.machineId,
        jobAreaSqmm: input.jobAreaSqmm,
        consumablesCost,
        powerCost,
        laborCost,
        overheadCost,
        depreciation: depreciationCost,
        maintenanceSavings: 0,
        printheadSavings: 0,
        insuranceCost: (machine.insuranceCostYr || 0) / 12, // Monthly allocation
        wasteCost,
        miscCost: (input.reworkEstimateCost || 0) + (input.environmentalFees || 0) + (input.extras || 0),
        totalCost,
        costPerSqmm
      }
    });

    return {
      breakdown: {
        depreciationCost,
        replacementSavings: 0,
        maintenanceSavings: 0,
        printheadSavings: 0,
        insuranceCostAllocated: (machine.insuranceCostYr || 0) / 12,
        consumablesCost,
        substrateCost:

 input.substrateCost || 0,
        adhesivesCost: 0,
        cleaningSuppliesCost: 0,
        wasteCost,
        powerCost,
        laborCost,
        overheadCost,
        wearAndTearCost: 0,
        softwareCost: (input.softwareLicenseYr || 0) / 12,
        reworkCost: input.reworkEstimateCost || 0,
        miscCost: (input.environmentalFees || 0) + (input.extras || 0)
      },
      totalCost,
      costPerSqmm,
      recommendedPrice,
      sensitivityAnalysis: {
        powerRateImpact: this.calculateSensitivity(powerCost, 0.1),
        consumableCostImpact: this.calculateSensitivity(consumablesCost, 0.1)
      },
      auditTrace: {
        ...input,
        calculatedAt: new Date()
      }
    };
  }

  private calculateDepreciation(purchasePrice: number, usefulLifeYears: number, jobAreaSqmm: number): number {
    const annualDepreciation = purchasePrice / usefulLifeYears;
    const hourlyDepreciation = annualDepreciation / (365 * 24); // Simplified
    const jobDepreciation = hourlyDepreciation * (job

AreaSqmm / 1000000); // Per sq meter
    return jobDepreciation;
  }

  private calculatePowerCost(powerKw: number, runTimeHours: number, ratePerKwh: number): number {
    return powerKw * runTimeHours * ratePerKwh;
  }

  private calculateLaborCost(operatorTimeHours: number, hourlyRate: number): number {
    return operatorTimeHours * hourlyRate;
  }

  private calculateOverheadCost(overhead: any, jobAreaSqmm: number): number {
    if (!overhead) return 0;
    const monthlyOverhead = overhead.facilityCostPerMonth + overhead.adminCosts;
    const costPerSqmm = monthlyOverhead / (overhead.productionCountPerMonth * 1000000); // Assuming 1M sqmm per job
    return costPerSqmm * jobAreaSqmm;
  }

  private calculateWasteCost(baseCost: number, wastePct: number): number {
    return baseCost * wastePct;
  }

  private calculateRecommendedPrice(totalCost: number, markupPct: number): number {
    return totalCost * (1 + markupPct);
  }

  private calculateSensitivity(costComponent: number, changePct: number): number

 {
    return costComponent * changePct;
  }

  async getCostingHistory(machineId: string, limit: number = 50): Promise<CostingRecord[]> {
    return this.prisma.costingRecord.findMany({
      where: { machineId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  async getAverageCostPerSqmm(machineId: string, days: number = 30): Promise<number> {
    const result = await this.prisma.costingRecord.aggregate({
      where: {
        machineId,
        createdAt: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      _avg: {
        costPerSqmm: true
      }
    });

    return result._avg.costPerSqmm || 0;
  }
}