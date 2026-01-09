export interface Order {
  id: string;
  quoteId: string;
  orderNumber: string;
  status: OrderStatus;
  productionManagerId?: string;
  shippingManagerId?: string;
  scheduledProductionAt?: Date;
  scheduledShippingAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  CREATED = 'created',
  SCHEDULED = 'scheduled',
  IN_PRODUCTION = 'in_production',
  PRODUCTION_FINISHED = 'production_finished',
  PACKAGING = 'packaging',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}