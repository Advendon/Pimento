import { PrismaClient } from '@prisma/client';
import { Customer, CustomerContact } from '../models';

export class CustomerService {
  constructor(private prisma: PrismaClient) {}

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.create({ data });
  }

  async getCustomers(organizationId: string): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      where: { organizationId },
      include: { contacts: true, quotes: true }
    });
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique

({
      where: { id },
      include: { 
        contacts: true, 
        quotes: true,
        organization: true 
      }
    });
  }

  interface CostingOutput {
  totalCost: number;
  markupAmount: number;
  finalPrice: number;
  breakdown: {
    materials: number;
    labor: number;
    overhead: number;
    profit: number;
  };
  currency: string;
  auditTrace: CostingInput & { calculatedAt: Date };
}

// Add currency conversion method
convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
  const rates = {
    ZAR: 1,
    USD: 0.053,
    EUR: 0.049,
    GBP: 0.042
  };
  
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to ZAR first (base currency)
  const zarAmount = fromCurrency === 'ZAR' ? amount : amount / rates[fromCurrency];
  // Then convert to target currency
  return toCurrency === 'ZAR' ? zarAmount : zarAmount * rates[toCurrency];
}

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data
    });
  }

  async deleteCustomer(id: string): Promise<Customer> {
    return this.prisma.customer.delete({ where: { id });
  }

  async addContact(customerId: string, contactData: Partial<CustomerContact>): Promise<CustomerContact> {
    return this.prisma.customerContact.create({
      data: { ...contactData, customerId }
    });
  }

  async updateContact(id: string, contactData: Partial<CustomerContact>): Promise<CustomerContact> {
    return this.prisma.customerContact.update({
      where: { id },
      data: contactData
    });
  }

  async deleteContact(id: string): Promise<CustomerContact> {
    return this.prisma.customerContact.delete({ where: { id });
  }
}