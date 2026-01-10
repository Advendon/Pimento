import { PrismaClient } from '@prisma/client';
import { CostingRecord } from '../models';
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
    auditTrace: CostingInput & {
        calculatedAt: Date;
    };
}
export declare class CostingService {
    private prisma;
    constructor(prisma: PrismaClient);
    calculateCost(input: CostingInput): Promise<CostingOutput>;
    private calculateDepreciation;
    private calculatePowerCost;
    private calculateLaborCost;
    private calculateOverheadCost;
    private calculateWasteCost;
    private calculateRecommendedPrice;
    private calculateSensitivity;
    getCostingHistory(machineId: string, limit?: number): Promise<CostingRecord[]>;
    getAverageCostPerSqmm(machineId: string, days?: number): Promise<number>;
}
//# sourceMappingURL=CostingService.d.ts.map