import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with sample data...');
  
  // Create sample organization
  const organization = await prisma.organization.create({
    data: {
      name: 'Drop Of Colour',
      planTier: 'premium'
    }
  });

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@dropofcolour.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash,
      active: true,  // Changed from isActive to active
      timezone: 'UTC',
      locale: 'en'
    }
  });

  console.log('✅ Sample data created successfully!');
  console.log('📧 Admin login: admin@dropofcolour.com');
  console.log('🔑 Admin password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });