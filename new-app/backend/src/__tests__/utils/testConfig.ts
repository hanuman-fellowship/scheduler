import prisma from '../../services/prisma';

// Ensure we're connected to the test database
export const ensureTestDatabase = async () => {
  if (!process.env.DATABASE_URL?.includes('scheduler_test')) {
    throw new Error('Tests must use scheduler_test database!');
  }
  
  try {
    await prisma.$connect();
    console.log('Connected to test database:', process.env.DATABASE_URL);
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
};

// Close test database connection
export const closeTestDatabase = async () => {
  await prisma.$disconnect();
};

// Reset test database to clean state
export const resetTestDatabase = async () => {
  try {
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
    
    console.log('Test database reset complete');
  } catch (error) {
    console.error('Failed to reset test database:', error);
    throw error;
  }
};

// Export the prisma client for use in tests
export { prisma };
