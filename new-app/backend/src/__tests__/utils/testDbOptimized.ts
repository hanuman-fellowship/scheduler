import { prisma } from './testConfig';

// Simple database reset between tests - more reliable than complex cleanup
export const resetTestDatabase = async () => {
  try {
    // Use a transaction for faster cleanup
    await prisma.$transaction(async (tx) => {
      // Clean up in reverse order of dependencies (most efficient order)
      await tx.changeField.deleteMany();
      await tx.changeModel.deleteMany();
      await tx.change.deleteMany();
      await tx.assignment.deleteMany();
      await tx.shift.deleteMany();
      await tx.floatingShift.deleteMany();
      await tx.constantShift.deleteMany();
      await tx.offDay.deleteMany();
      await tx.peopleSchedule.deleteMany();
      await tx.personnelNote.deleteMany();
      await tx.operationsNote.deleteMany();
      await tx.managerNote.deleteMany();
      await tx.area.deleteMany();
      await tx.day.deleteMany();
      await tx.residentCategory.deleteMany();
      await tx.schedule.deleteMany();
      await tx.role.deleteMany();
      await tx.user.deleteMany();
      await tx.person.deleteMany();
    });
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
};

// Test data interfaces
export interface TestUser {
  id: number;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface TestSchedule {
  id: number;
  name: string;
  userId: number | null;
  template: boolean;
  request: number;
}

export interface TestArea {
  id: number;
  name: string;
  shortName: string;
  notes?: string;
}

export interface TestDay {
  id: number;
  name: string;
  dayOfWeek: number;
}

export interface TestPerson {
  id: number;
  first: string;
  last: string;
  displayName: string;
}

export interface TestResidentCategory {
  id: number;
  name: string;
  scheduleId: number;
}

export interface TestShift {
  id: number;
  startTime: string;
  endTime: string;
  numPeople: number;
  areaId: number;
  dayId: number;
}

export interface TestAssignment {
  id: number;
  personId: number;
  shiftId: number;
}

// Simple test data creation
export const createTestUser = async (userData: Partial<Omit<TestUser, 'id'>>) => {
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash(userData.password || 'password123', 10);
  const roles = userData.roles || ['personnel'];

  const user = await prisma.user.create({
    data: {
      username: userData.username || 'testuser',
      email: userData.email || 'test@example.com',
      password: hashedPassword,
    },
  });

  // Create roles for the user
  if (roles.length > 0) {
    await prisma.role.createMany({
      data: roles.map(roleName => ({
        userId: user.id,
        name: roleName
      }))
    });
  }

  return user;
};

export const createTestSchedule = async (scheduleData: Partial<Omit<TestSchedule, 'id'>>) => {
  // If userId is not provided, create a default user
  let userId = scheduleData.userId;
  if (!userId) {
    const timestamp = Date.now();
    const user = await createTestUser({ 
      username: `testuser${timestamp}`, 
      email: `test${timestamp}@example.com` 
    });
    userId = user.id;
  }

  return await prisma.schedule.create({
    data: {
      name: scheduleData.name || 'Test Schedule',
      userId,
      template: scheduleData.template || false,
      request: scheduleData.request || 0,
    },
  });
};

export const createTestArea = async (scheduleId: number, areaData: Partial<Omit<TestArea, 'id'>>) => {
  return await prisma.area.create({
    data: {
      name: areaData.name || 'Test Area',
      shortName: areaData.shortName || 'TA',
      notes: areaData.notes || null,
      schedule: { connect: { id: scheduleId } }
    },
  });
};

export const createTestDay = async (scheduleId: number, dayData: Partial<Omit<TestDay, 'id'>>) => {
  return await prisma.day.create({
    data: {
      name: dayData.name || 'Monday',
      dayOfWeek: dayData.dayOfWeek || 1,
      schedule: { connect: { id: scheduleId } }
    },
  });
};

export const createTestPerson = async (personData: Partial<Omit<TestPerson, 'id'>>) => {
  return await prisma.person.create({
    data: {
      first: personData.first || 'John',
      last: personData.last || 'Doe',
      displayName: personData.displayName || 'John Doe',
    },
  });
};

export const createTestResidentCategory = async (scheduleId: number, categoryData: Partial<Omit<TestResidentCategory, 'id'>>) => {
  return await prisma.residentCategory.create({
    data: {
      name: categoryData.name || 'Test Category',
      schedule: { connect: { id: scheduleId } }
    },
  });
};

export const createTestShift = async (scheduleId: number, shiftData: Partial<Omit<TestShift, 'id'>>) => {
  // Create required day if dayId not provided
  let dayId = shiftData.dayId;
  if (!dayId) {
    const day = await createTestDay(scheduleId, { name: 'Test Day', dayOfWeek: 1 });
    dayId = day.id;
  }
  
  // Create required area if areaId not provided
  let areaId = shiftData.areaId;
  if (!areaId) {
    const area = await createTestArea(scheduleId, { name: 'Test Area', shortName: 'TA' });
    areaId = area.id;
  }

  return await prisma.shift.create({
    data: {
      scheduleId,
      start: shiftData.startTime || '09:00:00',
      end: shiftData.endTime || '17:00:00',
      numPeople: shiftData.numPeople || 1,
      areaId,
      dayId,
    },
  });
};

export const createTestAssignment = async (scheduleId: number, assignmentData: Partial<Omit<TestAssignment, 'id'>>) => {
  // Create required person if personId not provided
  let personId = assignmentData.personId;
  if (!personId) {
    const person = await createTestPerson({ first: 'Test', last: 'Person' });
    personId = person.id;
  }
  
  // Create required shift if shiftId not provided  
  let shiftId = assignmentData.shiftId;
  if (!shiftId) {
    const shift = await createTestShift(scheduleId, {});
    shiftId = shift.id;
  }

  return await prisma.assignment.create({
    data: {
      scheduleId,
      personId,
      shiftId,
    },
  });
};

export { prisma };
