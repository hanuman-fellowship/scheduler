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

  // Create the Published schedule (foundational schedule like legacy system)
  const publishedSchedule = await prisma.schedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Published',
      userId: null, // Published schedules have no owner (like legacy)
      template: false,
      request: 0
    }
  });

  // Create standard 7 days for the schedule (starting with Sunday)
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = [];
  
  for (let i = 0; i < dayNames.length; i++) {
    // Check if day already exists
    const existingDay = await prisma.day.findFirst({
      where: {
        scheduleId: publishedSchedule.id,
        name: dayNames[i]
      }
    });

    if (!existingDay) {
      const day = await prisma.day.create({
        data: {
          name: dayNames[i],
          scheduleId: publishedSchedule.id,
          dayOfWeek: i + 1, // 1=Sunday, 2=Monday, etc.
        }
      });
      days.push(day);
    } else {
      days.push(existingDay);
    }
  }

  // Create Kitchen area
  const existingArea = await prisma.area.findFirst({
    where: {
      scheduleId: publishedSchedule.id,
      name: 'Kitchen'
    }
  });

  const kitchenArea = existingArea || await prisma.area.create({
    data: {
      name: 'Kitchen',
      shortName: 'K',
      scheduleId: publishedSchedule.id,
      notes: 'Kitchen work area'
    }
  });

  // Create default category
  const existingCategory = await prisma.residentCategory.findFirst({
    where: {
      scheduleId: publishedSchedule.id,
      name: 'Residents'
    }
  });

  const residentsCategory = existingCategory || await prisma.residentCategory.create({
    data: {
      name: 'Residents',
      color: '#4ECDC4',
      sortOrder: 1,
      scheduleId: publishedSchedule.id
    }
  });

  console.log('✅ Seed data created:');
  console.log('  - User: admin / password123');
  console.log('  - Schedule:', publishedSchedule.name);
  console.log('  - Days:', days.map(d => d.name).join(', '));
  console.log('  - Area:', kitchenArea.name);
  console.log('  - Category:', residentsCategory.name);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });