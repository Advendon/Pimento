import { PrismaClient } from '@prisma/client';
import { Customer } from '../models';
export declare class CustomerService {
    private prisma;
    constructor(prisma: PrismaClient);
    createCustomer(data: Partial<Customer>): Promise<Customer>;
    getCustomers(organizationId: string): Promise<Customer[]>;
    getCustomerById(id: string): Promise<Customer | null>;
}
//# sourceMappingURL=CustomerService.d.ts.map