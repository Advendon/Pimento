import { DatabaseService } from '../database/DatabaseService';
import { OrderStatus } from '../models/Order';

export interface CreateOrderData {
  quoteId: string;
  orderNumber: string;
  customerDueDate?: Date;
  priority?: number;
  productionNotes?: string;
  shippingNotes?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  productionManagerId?: string;
  shippingManagerId?: string;
  scheduledProductionAt?: Date;
  scheduledShippingAt?: Date;
  customerDueDate?: Date;
  priority?: number;
  productionNotes?: string;
  shippingNotes?: string;
}

export class OrderService {
  constructor(private dbService: DatabaseService) {}

  async getAllOrders() {
    const prisma = this.dbService.getPrisma();
    return await prisma.order.findMany({
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true,
            creator: true
          }
        },
        productionManager: true,
        shippingManager: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrderById(id: string) {
    const prisma = this.dbService.getPrisma();
    return await prisma.order.findUnique({
      where: { id },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true,
            creator: true
          }
        },
        productionManager: true,
        shippingManager: true
      }
    });
  }

  async getOrdersByStatus(status: OrderStatus) {
    const prisma = this.dbService.getPrisma();
    return await prisma.order.findMany({
      where: { status },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createOrder(data: CreateOrderData) {
    const prisma = this.dbService.getPrisma();
    
    // Validate quote exists
    const quote = await prisma.quote.findUnique({
      where: { id: data.quoteId }
    });

    if (!quote) {
      throw new Error('Quote not found');
    }

    // Validate order number is unique
    const existingOrder = await prisma.order.findUnique({
      where: { orderNumber: data.orderNumber }
    });

    if (existingOrder) {
      throw new Error('Order number already exists');
    }

    return await prisma.order.create({
      data: {
        quoteId: data.quoteId,
        orderNumber: data.orderNumber,
        customerDueDate: data.customerDueDate,
        priority: data.priority || 1,
        productionNotes: data.productionNotes,
        shippingNotes: data.shippingNotes
      },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true
          }
        }
      }
    });
  }

  async updateOrder(id: string, data: UpdateOrderData) {
    const prisma = this.dbService.getPrisma();
    
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return await prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        productionManagerId: data.productionManagerId,
        shippingManagerId: data.shippingManagerId,
        scheduledProductionAt: data.scheduledProductionAt,
        scheduledShippingAt: data.scheduledShippingAt,
        customerDueDate: data.customerDueDate,
        priority: data.priority,
        productionNotes: data.productionNotes,
        shippingNotes: data.shippingNotes
      },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true
          }
        },
        productionManager: true,
        shippingManager: true
      }
    });
  }

  async deleteOrder(id: string) {
    const prisma = this.dbService.getPrisma();
    
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return await prisma.order.delete({
      where: { id }
    });
  }

  async getOrdersByCustomer(customerId: string) {
    const prisma = this.dbService.getPrisma();
    return await prisma.order.findMany({
      where: {
        quote: {
          customerId: customerId
        }
      },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOrdersByPriority(priority: number) {
    const prisma = this.dbService.getPrisma();
    return await prisma.order.findMany({
      where: { priority },
      include: {
        quote: {
          include: {
            customer: true,
            lineItems: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}