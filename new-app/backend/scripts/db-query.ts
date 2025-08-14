#!/usr/bin/env ts-node
/// <reference types="node" />

import { PrismaClient } from '../generated/prisma';

// Hardcoded database URL from devenv.nix
const databaseUrl = "postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler";

// Create Prisma client with explicit database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main(): Promise<void> {
  try {
    // Get SQL query from command line arguments
    if (process.argv.length < 3) {
      console.error('❌ Please provide a SQL query');
      console.error('Usage: npm run db:query "SELECT * FROM users"');
      process.exit(1);
    }

    const sql = process.argv.slice(2).join(' ');
    
    // Connect to database
    await prisma.$connect();
    
    // Execute query
    const startTime = Date.now();
    let result;
    
    if (sql.trim().toLowerCase().startsWith('select')) {
      result = await prisma.$queryRawUnsafe(sql);
    } else {
      result = await prisma.$executeRawUnsafe(sql);
    }
    
    const executionTime = Date.now() - startTime;
    
    // Output result (handle BigInt serialization)
    const safeResult = JSON.parse(JSON.stringify(result, (key, value) =>
      typeof value === 'bigint' ? Number(value) : value
    ));
    console.log(JSON.stringify(safeResult, null, 2));
    
    // Cleanup
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('❌ Query failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main().catch(console.error);
