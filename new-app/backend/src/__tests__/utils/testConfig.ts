import prisma from '../../services/prisma';

// Connection pool configuration for tests
const TEST_CONNECTION_LIMIT = 5;
const TEST_POOL_TIMEOUT = 20000;

// Ensure we're connected to the test database
export const ensureTestDatabase = async () => {
  if (!process.env.DATABASE_URL?.includes('scheduler_test')) {
    throw new Error('Tests must use scheduler_test database!');
  }
  
  try {
    // Test connection with timeout
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 5000)
      )
    ]);
    
    // Verify we can query the database
    await prisma.$queryRaw`SELECT 1`;
    
    console.log('✅ Connected to test database:', process.env.DATABASE_URL);
  } catch (error) {
    console.error('❌ Failed to connect to test database:', error);
    throw error;
  }
};

// Close test database connection
export const closeTestDatabase = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Test database connection closed');
  } catch (error) {
    console.error('❌ Failed to close test database connection:', error);
  }
};

// Reset test database to clean state using transactions for speed
export const resetTestDatabase = async () => {
  try {
    // Use a single transaction for faster cleanup
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
    
    console.log('✅ Test database reset complete');
  } catch (error) {
    console.error('❌ Failed to reset test database:', error);
    throw error;
  }
};

// Fast cleanup for specific test data (more efficient than full reset)
export const cleanupTestData = async (tableNames: string[]) => {
  try {
    await prisma.$transaction(async (tx) => {
      for (const tableName of tableNames) {
        // Use dynamic table deletion for flexibility
        await (tx as any)[tableName].deleteMany();
      }
    });
  } catch (error) {
    console.error('❌ Failed to cleanup test data:', error);
    throw error;
  }
};

// Export the prisma client for use in tests
export { prisma };
