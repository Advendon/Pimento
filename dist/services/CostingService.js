"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostingService = void 0;
class CostingService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateCost(input) {
        const machine = await this.prisma.machine.findUnique({
            where: { id: input.machineId }
        });
        if (!machine) {
            throw new Error('Machine not found');
        }
        const depreciationCost = this.calculateDepreciation(machine.purchasePrice || 0, machine.usefulLifeYears || 5, input.jobAreaSqmm);
        const powerCost = this.calculatePowerCost(machine.powerKw || 0, input.runTimeHours, 0.12);
        const laborCost = this.calculateLaborCost(input.operatorTimeHours, 25);
        const consumablesCost = input.consumablesList.reduce((total, item) => total + (item.qtyUsed * item.costPerUnit), 0);
        const overheadCost = this.calculateOverheadCost(input.overheadAllocations, input.jobAreaSqmm);
        const wasteCost = this.calculateWasteCost(consumablesCost + (input.substrateCost || 0), input.wastePct || 0.05);
        const totalCost = depreciationCost + powerCost + laborCost +
            consumablesCost + overheadCost + wasteCost +
            (input.reworkEstimateCost || 0) + (input.environmentalFees || 0) +
            (input.extras || 0);
        const costPerSqmm = totalCost / input.job;
        AreaSqmm;
        const recommendedPrice = this.calculateRecommendedPrice(totalCost, 0.3);
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
                insuranceCost: (machine.insuranceCostYr || 0) / 12,
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
                substrateCost: input.substrateCost || 0,
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
    calculateDepreciation(purchasePrice, usefulLifeYears, jobAreaSqmm) {
        const annualDepreciation = purchasePrice / usefulLifeYears;
        const hourlyDepreciation = annualDepreciation / (365 * 24);
        const jobDepreciation = hourlyDepreciation * (job);
        AreaSqmm / 1000000;
        ;
        return jobDepreciation;
    }
    calculatePowerCost(powerKw, runTimeHours, ratePerKwh) {
        return powerKw * runTimeHours * ratePerKwh;
    }
    calculateLaborCost(operatorTimeHours, hourlyRate) {
        return operatorTimeHours * hourlyRate;
    }
    calculateOverheadCost(overhead, jobAreaSqmm) {
        if (!overhead)
            return 0;
        const monthlyOverhead = overhead.facilityCostPerMonth + overhead.adminCosts;
        const costPerSqmm = monthlyOverhead / (overhead.productionCountPerMonth * 1000000);
        return costPerSqmm * jobAreaSqmm;
    }
    calculateWasteCost(baseCost, wastePct) {
        return baseCost * wastePct;
    }
    calculateRecommendedPrice(totalCost, markupPct) {
        return totalCost * (1 + markupPct);
    }
    calculateSensitivity(costComponent, changePct) {
        return costComponent * changePct;
    }
    async getCostingHistory(machineId, limit = 50) {
        return this.prisma.costingRecord.findMany({
            where: { machineId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
    async getAverageCostPerSqmm(machineId, days = 30) {
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
exports.CostingService = CostingService;
//# sourceMappingURL=CostingService.js.map