export interface Consumable {
  id: string;
  organizationId: string;
  name: string;
  sku?: string;
  unitCost: number;
  unitMeasure: string;
  stockQty: number;
  reorderPoint: number;
  storageLocation?: string;
  createdAt: Date;
  updatedAt: Date;
}