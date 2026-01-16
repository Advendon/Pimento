import { Router } from 'express';
import { DatabaseService } from '../database/DatabaseService';

export function createOrderRoutes(dbService: DatabaseService): Router {
  const router = Router();

  router.get('/', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const orders = await prisma.order.findMany({
        include: {
          quote: {
            include: {
              customer: {
                include: {
                  contacts: true
                }
              },
              lineItems: true
            }
          },
          productionManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          shippingManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders'
      });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const order = await prisma.order.findUnique({
        where: { id: req.params.id },
        include: {
          quote: {
            include: {
              customer: {
                include: {
                  contacts: true
                }
              },
              lineItems: true
            }
          },
          productionManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          shippingManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to fetch order'
      });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const { 
        quoteId,
        orderNumber,
        status,
        productionManagerId,
        shippingManagerId,
        scheduledProductionAt,
        scheduledShippingAt,
        customerDueDate,
        priority,
        productionNotes,
        shippingNotes
      } = req.body;

      if (!quoteId || !orderNumber) {
        return res.status(400).json({ error: 'Quote ID and Order Number are required' });
      }

      const existingOrder = await prisma.order.findFirst({
        where: {
          OR: [
            { quoteId },
            { orderNumber }
          ]
        }
      });

      if (existingOrder) {
        return res.status(400).json({ 
          error: existingOrder.quoteId === quoteId 
            ? 'An order already exists for this quote' 
            : 'Order number already exists'
        });
      }

      const order = await prisma.order.create({
        data: {
          quoteId,
          orderNumber,
          status: status || 'created',
          productionManagerId: productionManagerId || null,
          shippingManagerId: shippingManagerId || null,
          scheduledProductionAt: scheduledProductionAt ? new Date(scheduledProductionAt) : null,
          scheduledShippingAt: scheduledShippingAt ? new Date(scheduledShippingAt) : null,
          customerDueDate: customerDueDate ? new Date(customerDueDate) : null,
          priority: priority || 1,
          productionNotes: productionNotes || null,
          shippingNotes: shippingNotes || null
        },
        include: {
          quote: {
            include: {
              customer: {
                include: {
                  contacts: true
                }
              },
              lineItems: true
            }
          },
          productionManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          shippingManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to create order'
      });
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      const { 
        status,
        productionManagerId,
        shippingManagerId,
        scheduledProductionAt,
        scheduledShippingAt,
        customerDueDate,
        priority,
        productionNotes,
        shippingNotes
      } = req.body;

      const existingOrder = await prisma.order.findUnique({
        where: { id: req.params.id }
      });

      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const order = await prisma.order.update({
        where: { id: req.params.id },
        data: {
          status: status !== undefined ? status : existingOrder.status,
          productionManagerId: productionManagerId !== undefined ? productionManagerId : existingOrder.productionManagerId,
          shippingManagerId: shippingManagerId !== undefined ? shippingManagerId : existingOrder.shippingManagerId,
          scheduledProductionAt: scheduledProductionAt !== undefined 
            ? (scheduledProductionAt ? new Date(scheduledProductionAt) : null)
            : existingOrder.scheduledProductionAt,
          scheduledShippingAt: scheduledShippingAt !== undefined 
            ? (scheduledShippingAt ? new Date(scheduledShippingAt) : null)
            : existingOrder.scheduledShippingAt,
          customerDueDate: customerDueDate !== undefined 
            ? (customerDueDate ? new Date(customerDueDate) : null)
            : existingOrder.customerDueDate,
          priority: priority !== undefined ? priority : existingOrder.priority,
          productionNotes: productionNotes !== undefined ? productionNotes : existingOrder.productionNotes,
          shippingNotes: shippingNotes !== undefined ? shippingNotes : existingOrder.shippingNotes
        },
        include: {
          quote: {
            include: {
              customer: {
                include: {
                  contacts: true
                }
              },
              lineItems: true
            }
          },
          productionManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          shippingManager: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.json(order);
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to update order'
      });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const prisma = dbService.getPrisma();
      
      const existingOrder = await prisma.order.findUnique({
        where: { id: req.params.id }
      });

      if (!existingOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      await prisma.order.delete({
        where: { id: req.params.id }
      });

      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(400).json({ 
        error: error instanceof Error ? error.message : 'Failed to delete order'
      });
    }
  });

  return router;
}