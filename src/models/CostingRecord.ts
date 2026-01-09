export interface CostingRecord {
  id: string;
  machineId: string;
  jobAreaSqmm: number;
  consumablesCost: number;
  powerCost: number;
  laborCost: number;
  overheadCost: number;
  depreciation: number;
  maintenanceSavings: number;
  printheadSavings: number;
  insuranceCost: number;
  wasteCost: number;
  miscCost: number;
  totalCost: number;
  costPerSqmm: number;
  createdAt: Date;
}