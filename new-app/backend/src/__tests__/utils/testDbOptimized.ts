import { prisma } from './testConfig';
import { createTestUserData, PRECOMPUTED_PASSWORD_HASH } from './authTestHelpers';
import type { UserRole } from '@shared/types';

// Fast database reset using TRUNCATE CASCADE - much faster than deleteMany
export const resetTestDatabase = async () => {
  try {
    // Use raw SQL for maximum performance
    await prisma.$executeRaw`
      TRUNCATE TABLE 
        "change_fields", 
        "change_models", 
        "changes", 
        "assignments", 
        "shifts", 
        "floating_shifts", 
        "constant_shifts", 
        "off_days", 
        "people_schedules", 
        "personnel_notes", 
        "operations_notes", 
        "manager_notes", 
        "areas", 
        "days", 
        "resident_categories", 
        "schedules", 
        "roles", 
        "users", 
        "people"
      RESTART IDENTITY CASCADE
    `;
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
};

// Alternative transaction-based reset if needed for specific tests
export const resetTestDatabaseTransaction = async () => {
  try {
    // Use a transaction for safer cleanup when needed
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
  roles: UserRole[];
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
  startAtSeconds: number;
  endAtSeconds: number;
  numPeople: number;
  areaId: number;
  dayId: number;
}

export interface TestAssignment {
  id: number;
  personId: number;
  shiftId: number;
}

// Simple test data creation using precomputed hash for speed
export const createTestUser = async (userData: Partial<Omit<TestUser, 'id'>>) => {
  const testUserData = createTestUserData({
    username: userData.username,
    email: userData.email,
    password: userData.password,
    roles: userData.roles
  });

  const user = await prisma.user.create({
    data: {
      username: testUserData.username,
      email: testUserData.email,
      password: PRECOMPUTED_PASSWORD_HASH, // Use precomputed hash - much faster
    },
  });

  // Create roles for the user
  if (testUserData.roles.length > 0) {
    await prisma.role.createMany({
      data: testUserData.roles.map(roleName => ({
        userId: user.id,
        name: roleName
      }))
    });
  }

  return user;
};

export const createTestSchedule = async (scheduleData: { name?: string; userId: number | null; template?: boolean; request?: number }) => {
  return await prisma.schedule.create({
    data: {
      name: scheduleData.name || 'Test Schedule',
      userId: scheduleData.userId,
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
      startAtSeconds: shiftData.startAtSeconds || 32400, // 09:00:00 = 9*3600 = 32400 seconds
      endAtSeconds: shiftData.endAtSeconds || 61200,     // 17:00:00 = 17*3600 = 61200 seconds
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
