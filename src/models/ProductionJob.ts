export interface ProductionJob {
  id: string;
  orderId: string;
 

 machineId: string;
  moduleType: string;
  status: ProductionJobStatus;
  setupTimeMin: number;
  runTimeMin: number;
  operatorId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProductionJobStatus {
  PENDING = 'pending',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}