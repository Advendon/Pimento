import { PrismaClient, QuoteStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample data...');
  
  const organization = await prisma.organization.create({
    data: {
      name: 'Drop Of Colour',
      planTier: 'premium'
    }
  });

  const passwordHash = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dropofcolour.com',
      name: 'Admin User',
      role: 'admin',
<<<<<<< Updated upstream
      passwordHash,
      isActive: true,
      timezone: 'UTC',
      locale: 'en'
=======
      passwordHash
>>>>>>> Stashed changes
    }
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@dropofcolour.com',
      name: 'Sales Manager',
      role: 'sales',
<<<<<<< Updated upstream
      passwordHash: await bcrypt.hash('sales123', 12),
      isActive: true,
      timezone: 'UTC',
      locale: 'en'
=======
      passwordHash: await bcrypt.hash('sales123', 12)
>>>>>>> Stashed changes
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
      quoteNumber: 'QT-2024-001',
      status: 'approved',
      createdBy: adminUser.id,
      totalQuantity: 100,
      totalAmount: 2500.00,
      productionDue: new Date('2024-12-31'),
      customerDue: new Date('2025-01-05'),
      productionNotes: 'Rush order - priority production',
      lineItems: {
        create: [
          {
            category: 'DTF Printing',
            description: 'Custom t-shirt transfers',
            quantity: 100,
            unitPrice: 25.00,
            total: 2500.00
          }
        ]
      }
    }
  });

  const quote2 = await prisma.quote.create({
    data: {
      organizationId: organization.id,
      customerId: customer2.id,
      quoteNumber: 'QT-2024-002',
      status: 'approved',
      createdBy: salesUser.id,
      totalQuantity: 50,
      totalAmount: 3750.00,
      productionDue: new Date('2024-12-28'),
      customerDue: new Date('2025-01-02'),
      productionNotes: 'High quality UV printing required',
      lineItems: {
        create: [
          {
            category: 'UV Printing',
            description: 'Corporate signage',
            quantity: 50,
            unitPrice: 75.00,
            total: 3750.00
          }
        ]
      }
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:`);
  console.log(`   - 1 Organization: ${organization.name}`);
  console.log(`   - 2 Users (admin, sales)`);
  console.log(`   - 3 Customers`);
  console.log(`   - 3 Customer Contacts`);
  console.log(`   - 2 Quotes`);
}

main()
  .catch((e) => {
<<<<<<< Updated upstream
    console.error('❌ Seeding failed:', e);
=======
    console.error('❌ Error seeding database:', e);
>>>>>>> Stashed changes
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });