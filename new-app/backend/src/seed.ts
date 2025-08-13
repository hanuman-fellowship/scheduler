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

  // Create a schedule group for the current period (published schedules need groups)
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // End of current week (Saturday)

  const scheduleGroup = await prisma.scheduleGroup.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Current Week',
      start: startOfWeek,
      end: endOfWeek
    }
  });

  // Create the Published schedule (properly published with schedule group)
  const publishedSchedule = await prisma.schedule.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Published',
      userId: null, // Published schedules have no owner (like legacy)
      scheduleGroupId: scheduleGroup.id, // This makes it truly published
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

  // Create a sample person for the schedule
  const existingPerson = await prisma.person.findFirst({
    where: {
      first: 'Sample',
      last: 'Person'
    }
  });

  const samplePerson = existingPerson || await prisma.person.create({
    data: {
      first: 'Sample',
      last: 'Person',
      displayName: 'Sample Person'
    }
  });

  // Add the person to this schedule with the residents category
  const existingPersonSchedule = await prisma.peopleSchedule.findFirst({
    where: {
      personId: samplePerson.id,
      scheduleId: publishedSchedule.id
    }
  });

  const personSchedule = existingPersonSchedule || await prisma.peopleSchedule.create({
    data: {
      personId: samplePerson.id,
      scheduleId: publishedSchedule.id,
      residentCategoryId: residentsCategory.id
    }
  });

  // Create a sample shift (Morning Kitchen - Monday 8:00 AM - 12:00 PM)
  const mondayDay = days.find(d => d.name === 'Monday');
  if (mondayDay) {
    const existingShift = await prisma.shift.findFirst({
      where: {
        areaId: kitchenArea.id,
        dayId: mondayDay.id,
        startAtSeconds: 28800, // 8:00 AM
        endAtSeconds: 43200    // 12:00 PM
      }
    });

    const sampleShift = existingShift || await prisma.shift.create({
      data: {
        areaId: kitchenArea.id,
        dayId: mondayDay.id,
        scheduleId: publishedSchedule.id,
        startAtSeconds: 28800, // 8:00 AM (8 * 60 * 60)
        endAtSeconds: 43200,   // 12:00 PM (12 * 60 * 60)
        numPeople: 2
      }
    });

    // Create a sample assignment
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        shiftId: sampleShift.id,
        personId: samplePerson.id
      }
    });

    if (!existingAssignment) {
      await prisma.assignment.create({
        data: {
          shiftId: sampleShift.id,
          scheduleId: publishedSchedule.id,
          personId: samplePerson.id,
          star: false
        }
      });
    }
  }

  console.log('✅ Seed data created:');
  console.log('  - User: admin / password123');
  console.log('  - Schedule Group:', scheduleGroup.name, `(${scheduleGroup.start.toDateString()} - ${scheduleGroup.end.toDateString()})`);
  console.log('  - Schedule:', publishedSchedule.name, '(properly published)');
  console.log('  - Days:', days.map(d => d.name).join(', '));
  console.log('  - Area:', kitchenArea.name);
  console.log('  - Category:', residentsCategory.name);
  console.log('  - Person:', samplePerson.displayName || `${samplePerson.first} ${samplePerson.last}`, '(assigned to schedule)');
  console.log('  - Sample shift: Monday 8:00 AM - 12:00 PM in Kitchen (with assignment)');
  console.log('');
  console.log('🎯 Ready to use: Load "Published" schedule and use "Edit a Copy..." to create your first working schedule!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });