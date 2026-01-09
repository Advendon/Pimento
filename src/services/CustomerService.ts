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