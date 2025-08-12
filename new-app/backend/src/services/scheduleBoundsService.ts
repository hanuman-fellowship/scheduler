import prisma from './prisma';
import type { ScheduleBounds } from '@shared/types';
import { getTimePeriods } from '@shared/types';

export const getScheduleBounds = async (scheduleId: number): Promise<ScheduleBounds> => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      days: {
        orderBy: { dayOfWeek: 'asc' }
      }
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const days: { [key: number]: string } = {};
  schedule.days.forEach(day => {
    days[day.id] = day.name;
  });

  // Use centralized time periods
  const timePeriods = getTimePeriods();

  return {
    days,
    timePeriods
  };
};

// Legacy functions removed - using simplified time period system

export const getCurrentScheduleId = async (): Promise<number> => {
  const currentSchedule = await prisma.schedule.findFirst({
    where: { name: 'Published' },
    orderBy: { id: 'asc' }
  });

  if (!currentSchedule) {
    throw new Error('No published schedule found');
  }

  return currentSchedule.id;
};