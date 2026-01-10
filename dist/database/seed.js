"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database with sample data...');
    const organization = await prisma.organization.create({
        data: {
            name: 'Drop Of Colour',
            planTier: 'premium'
        }
    });
    const passwordHash = await bcrypt_1.default.hash('admin123', 12);
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@dropofcolour.com',
            name: 'Admin User',
            role: 'admin',
            passwordHash,
            isActive: true,
            timezone: 'UTC',
            locale: 'en'
        }
    });
    const salesUser = await prisma.user.create({
        data: {
            email: 'sales@dropofcolour.com',
            name: 'Sales Manager',
            role: 'sales',
            passwordHash: await bcrypt_1.default.hash('sales123', 12),
            isActive: true,
            timezone: 'UTC',
            locale: 'en'
        }
    });
    const customer1 = await prisma.customer.create({
        data: {
            organizationId: organization.id,
            companyName: 'ABC Printing Solutions',
            accountNumber: 'CUST-001',
            notes: 'Regular customer for promotional items'
        }
    });
    const customer2 = await prisma.customer.create({
        data: {
            organizationId: organization.id,
            companyName: 'XYZ Corporate Gifts',
            accountNumber: 'CUST-002',
            notes: 'Bulk orders for corporate events'
        }
    });
    const customer3 = await prisma.customer.create({
        data: {
            organizationId: organization.id,
            companyName: 'Design Studio Pro',
            accountNumber: 'CUST-003',
            notes: 'High-end custom designs'
        }
    });
    await prisma.customerContact.createMany({
        data: [
            {
                customerId: customer1.id,
                name: 'John Smith',
                email: 'john@abcprinting.com',
                phone: '+1-555-0101',
                isBilling: true,
                isShipping: true
            },
            {
                customerId: customer2.id,
                name: 'Sarah Johnson',
                email: 'sarah@xyzcorporate.com',
                phone: '+1-555-0102',
                isBilling: true,
                isShipping: false
            },
            {
                customerId: customer3.id,
                name: 'Mike Wilson',
                email: 'mike@designstudiopro.com',
                phone: '+1-555-0103',
                isBilling: true,
                isShipping: true
            }
        ]
    });
    const quote1 = await prisma.quote.create({
        data: {
            organizationId: organization.id,
            customerId: customer1.id,
            quoteNumber: 'Q-2024-001',
            status: client_1.QuoteStatus.approved,
            productionDue: new Date('2024-02-15'),
            customerDue: new Date('2024-02-20'),
            totalQuantity: 500,
            totalAmount: 2500.00,
            productionNotes: 'Use premium quality materials, double-check color matching',
            createdBy: salesUser.id,
            approvedBy: adminUser.id,
            approvedAt: new Date('2024-01-15')
        }
    });
    const quote2 = await prisma.quote.create({
        data: {
            organizationId: organization.id,
            customerId: customer2.id,
            quoteNumber: 'Q-2024-002',
            status: client_1.QuoteStatus.draft,
            productionDue: new Date('2024-03-01'),
            customerDue: new Date('2024-03-10'),
            totalQuantity: 1000,
            totalAmount: 4500.00,
            productionNotes: 'Rush order - prioritize in production schedule',
            createdBy: salesUser.id
        }
    });
    const quote3 = await prisma.quote.create({
        data: {
            organizationId: organization.id,
            customerId: customer3.id,
            quoteNumber: 'Q-2024-003',
            status: client_1.QuoteStatus.approval_sent,
            productionDue: new Date('2024-02-28'),
            customerDue: new Date('2024-03-05'),
            totalQuantity: 250,
            totalAmount: 1875.00,
            productionNotes: 'Custom design requirements - see attached specifications',
            createdBy: salesUser.id
        }
    });
    await prisma.quoteLineItem.createMany({
        data: [
            {
                quoteId: quote1.id,
                category: 'DTF Printing',
                itemCode: 'DTF-TSHIRT-001',
                description: 'Custom DTF printed t-shirts - 500 units',
                color: 'Full Color',
                quantity: 500,
                unitPrice: 4.50,
                markupPct: 11.11,
                total: 2250.00,
                productionInstructions: 'Use high-quality transfer film, cure at 320°F for 90 seconds'
            },
            {
                quoteId: quote1.id,
                category: 'Packaging',
                itemCode: 'PACK-BOX-001',
                description: 'Custom packaging boxes',
                color: 'White',
                quantity: 50,
                unitPrice: 5.00,
                markupPct: 0,
                total: 250.00,
                productionInstructions: 'Pack in batches of 10'
            },
            {
                quoteId: quote2.id,
                category: 'UV Printing',
                itemCode: 'UV-MUG-001',
                description: 'UV printed ceramic mugs - 1000 units',
                color: 'Full Color',
                quantity: 1000,
                unitPrice: 3.50,
                markupPct: 28.57,
                total: 3500.00,
                productionInstructions: 'Ensure proper curing time for UV ink'
            },
            {
                quoteId: quote2.id,
                category: 'Screen Printing',
                itemCode: 'SCR-BAG-001',
                description: 'Screen printed tote bags',
                color: '2 Color',
                quantity: 500,
                unitPrice: 2.00,
                markupPct: 0,
                total: 1000.00,
                productionInstructions: 'Use 110 mesh count screen'
            },
            {
                quoteId: quote3.id,
                category: 'Vinyl Cutting',
                itemCode: 'VIN-DECAL-001',
                description: 'Custom vinyl decals - 250 units',
                color: 'Black',
                quantity: 250,
                unitPrice: 6.00,
                markupPct: 25.00,
                total: 1500.00,
                productionInstructions: 'Use premium outdoor vinyl, apply transfer tape'
            },
            {
                quoteId: quote3.id,
                category: 'Laser Engraving',
                itemCode: 'LAS-PLAQUE-001',
                description: 'Laser engraved plaques',
                color: 'Natural',
                quantity: 25,
                unitPrice: 15.00,
                markupPct: 0,
                total: 375.00,
                productionInstructions: 'Use 600 DPI resolution for fine detail'
            }
        ]
    });
    await prisma.order.create({
        data: {
            quoteId: quote1.id,
            orderNumber: 'ORD-2024-001',
            status: 'created',
            productionManagerId: adminUser.id,
            scheduledProductionAt: new Date('2024-02-10'),
            scheduledShippingAt: new Date('2024-02-18')
        }
    });
    console.log('✅ Sample data created successfully!');
    console.log('📧 Admin login: admin@dropofcolour.com');
    console.log('🔑 Admin password: admin123');
    console.log('📧 Sales login: sales@dropofcolour.com');
    console.log('🔑 Sales password: sales123');
    console.log(`📝 Created 3 quotes with line items`);
    console.log(`👥 Created 3 customers with contacts`);
    console.log(`📦 Created 1 order from approved quote`);
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map