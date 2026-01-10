"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
class CustomerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCustomer(data) {
        return this.prisma.customer.create({ data });
    }
    async getCustomers(organizationId) {
        return this.prisma.customer.findMany({
            where: { organizationId },
            include: { contacts: true, quotes: true }
        });
    }
    async getCustomerById(id) {
        return this.prisma.customer.findUnique({
            where: { id },
            include: {
                contacts: true,
                quotes: true,
                organization: true
            }
        });
    }
}
exports.CustomerService = CustomerService;
convertCurrency(amount, number, fromCurrency, string, toCurrency, string);
number;
{
    const rates = {
        ZAR: 1,
        USD: 0.053,
        EUR: 0.049,
        GBP: 0.042
    };
    if (fromCurrency === toCurrency)
        return amount;
    const zarAmount = fromCurrency === 'ZAR' ? amount : amount / rates[fromCurrency];
    return toCurrency === 'ZAR' ? zarAmount : zarAmount * rates[toCurrency];
}
async;
updateCustomer(id, string, data, (Partial));
Promise < models_1.Customer > {
    return: this.prisma.customer.update({
        where: { id },
        data
    })
};
async;
deleteCustomer(id, string);
Promise < models_1.Customer > {
    return: this.prisma.customer.delete({ where: { id } })
};
async;
addContact(customerId, string, contactData, (Partial));
Promise < models_1.CustomerContact > {
    return: this.prisma.customerContact.create({
        data: { ...contactData, customerId }
    })
};
async;
updateContact(id, string, contactData, (Partial));
Promise < models_1.CustomerContact > {
    return: this.prisma.customerContact.update({
        where: { id },
        data: contactData
    })
};
async;
deleteContact(id, string);
Promise < models_1.CustomerContact > {
    return: this.prisma.customerContact.delete({ where: { id } })
};
//# sourceMappingURL=CustomerService.js.map