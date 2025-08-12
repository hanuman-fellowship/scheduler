import { prisma } from './testConfig';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@shared/types';

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

// Counter for generating unique test data
let userCounter = 0;
let scheduleCounter = 0;

export const createTestUser = async (userData: Partial<Omit<TestUser, 'id'>> = {}): Promise<TestUser> => {
  userCounter++;
  const defaultUser: Omit<TestUser, 'id'> = {
    username: `testuser${userCounter}`,
    email: `test${userCounter}@example.com`,
    password: 'password',
    roles: ['personnel'],
    ...userData
  };

  const hashedPassword = await bcrypt.hash(defaultUser.password, 10);
  
  const user = await prisma.user.create({
    data: {
      username: defaultUser.username,
      email: defaultUser.email,
      password: hashedPassword,
      roles: {
        create: defaultUser.roles.map(role => ({ name: role }))
      }
    },
    include: {
      roles: true
    }
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    password: defaultUser.password, // Return plain password for testing
    roles: user.roles.map((r: { name: string }) => r.name as UserRole)
  };
};

export const createTestSchedule = async (scheduleData: Partial<Omit<TestSchedule, 'id'>> = {}): Promise<TestSchedule> => {
  scheduleCounter++;
  const defaultSchedule: Omit<TestSchedule, 'id'> = {
    name: `Test Schedule ${scheduleCounter}`,
    userId: null, // Make userId optional since schedules can exist without users
    template: false,
    request: 0,
    ...scheduleData
  };

  const schedule = await prisma.schedule.create({
    data: {
      name: defaultSchedule.name,
      userId: defaultSchedule.userId,
      template: defaultSchedule.template,
      request: defaultSchedule.request
    }
  });

  return {
    id: schedule.id,
    name: schedule.name,
    userId: schedule.userId || 0, // Return 0 if no user
    template: schedule.template,
    request: schedule.request
  };
};

export const createTestArea = async (scheduleId: number, areaData: Partial<{ name: string; shortName: string }> = {}) => {
  const defaultArea = {
    name: 'Test Area',
    shortName: 'TA',
    ...areaData
  };

  return await prisma.area.create({
    data: {
      scheduleId,
      name: defaultArea.name,
      shortName: defaultArea.shortName
    }
  });
};

export const createTestDay = async (scheduleId: number, dayData: Partial<{ name: string; dayOfWeek: number }> = {}) => {
  const defaultDay = {
    name: 'Monday',
    dayOfWeek: 2, // Monday
    ...dayData
  };

  return await prisma.day.create({
    data: {
      scheduleId,
      name: defaultDay.name,
      dayOfWeek: defaultDay.dayOfWeek
    }
  });
};

export const createTestPerson = async (personData: Partial<{ first: string; last: string; displayName?: string }> = {}) => {
  const defaultPerson = {
    first: 'John',
    last: 'Doe',
    ...personData
  };

  return await prisma.person.create({
    data: {
      first: defaultPerson.first,
      last: defaultPerson.last,
      displayName: defaultPerson.displayName
    }
  });
};

export const createTestResidentCategory = async (scheduleId: number, categoryData: Partial<{ name: string; color: string }> = {}) => {
  const defaultCategory = {
    name: 'Resident',
    color: '#007bff',
    ...categoryData
  };

  return await prisma.residentCategory.create({
    data: {
      scheduleId,
      name: defaultCategory.name,
      color: defaultCategory.color
    }
  });
};

export const cleanupTestData = async () => {
  // Clean up in reverse order of dependencies
  await prisma.changeField.deleteMany();
  await prisma.changeModel.deleteMany();
  await prisma.change.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.floatingShift.deleteMany();
  await prisma.constantShift.deleteMany();
  await prisma.offDay.deleteMany();
  await prisma.peopleSchedule.deleteMany();
  await prisma.personnelNote.deleteMany();
  await prisma.operationsNote.deleteMany();
  await prisma.managerNote.deleteMany();
  await prisma.area.deleteMany();
  await prisma.day.deleteMany();
  await prisma.residentCategory.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.role.deleteMany();
  await prisma.user.deleteMany();
  await prisma.person.deleteMany();
};

export const resetTestDatabase = async () => {
  await cleanupTestData();
};

// Reset counters for clean test runs
export const resetTestCounters = () => {
  userCounter = 0;
  scheduleCounter = 0;
};

export { prisma };
