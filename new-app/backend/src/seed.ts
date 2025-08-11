import bcrypt from 'bcryptjs';
import prisma from './services/prisma';

async function main() {
  console.log('🌱 Seeding database...');

  // Create operations user (admin with full access)
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'shantam@mountmadonna.org',
      password: password,
      roles: {
        create: { name: 'operations' }
      }
    }
  });

  // Create a test schedule
  const schedule = await prisma.schedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Main Schedule',
      userId: user.id,
      template: false,
      request: 0
    }
  });

  console.log('✅ Seed data created:');
  console.log('  - User: admin / password123');
  console.log('  - Schedule:', schedule.name);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });