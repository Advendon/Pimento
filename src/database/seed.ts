import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create organization
  const organization = await prisma.organization.create({
    data: {
      name: 'DROP OF COLOUR',
      planTier: 'premium'
    }
  });

  // Create users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dropofcolour.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash: await bcrypt.hash('admin123', 10)
    }
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@dropofcolour.com',
      name: 'Sales Manager',
      role: 'sales',
      passwordHash: await bcrypt.hash('sales123', 10)
    }
  });

  // Create customer
  const customer = await prisma.customer.create({
    data: {
      organizationId: organization.id,
      companyName: 'Local Print Shop Inc.',
      accountNumber: 'CUST-001',
      notes: 'Regular customer for DTF and UV printing'
    }
  });

  // Create customer contact
  await prisma.customerContact.create({
    data: {
      customerId: customer.id,
      name: 'John Smith',
      email: 'john@localprintshop.com',
      phone: '+1-555-0123',
      isBilling: true,
      isShipping: true
    }
  });

  console.log('✅ Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });