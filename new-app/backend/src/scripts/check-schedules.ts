import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSchedules() {
  const schedules = await prisma.schedule.findMany({
    select: {
      id: true,
      name: true,
      userId: true,
      template: true,
      request: true
    },
    orderBy: { id: 'asc' }
  })
  
  console.log('All schedules:')
  console.table(schedules)
  
  await prisma.$disconnect()
}

checkSchedules().catch(console.error)