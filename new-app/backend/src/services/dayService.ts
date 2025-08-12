import prisma from './prisma';

export interface Day {
  id: number;
  scheduleId: number;
  name: string;
  date?: string;
  dayOfWeek: number;
}

export async function getAllDays(scheduleId: number): Promise<Day[]> {
  const days = await prisma.day.findMany({
    where: { scheduleId },
    orderBy: { dayOfWeek: 'asc' },
  });

  return days.map(transformDayResponse);
}

export async function getDayById(id: number): Promise<Day | null> {
  const day = await prisma.day.findUnique({
    where: { id },
  });

  return day ? transformDayResponse(day) : null;
}

// Helper functions
function transformDayResponse(day: any): Day {
  return {
    id: day.id,
    scheduleId: day.scheduleId,
    name: day.name,
    date: day.date ? day.date.toISOString().split('T')[0] : undefined,
    dayOfWeek: day.dayOfWeek,
  };
}