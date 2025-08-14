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

// Get user's current schedule preference or fallback to default
export const getUserCurrentScheduleId = async (userId: number): Promise<number> => {
  // First, check if user has a stored schedule preference
  const userSetting = await prisma.setting.findFirst({
    where: {
      userId: userId,
      key: 'current_schedule_id'
    }
  });
  
  if (userSetting) {
    const preferredScheduleId = parseInt(userSetting.val);
    if (!isNaN(preferredScheduleId)) {
      // Verify the preferred schedule still exists
      const schedule = await prisma.schedule.findUnique({
        where: { id: preferredScheduleId }
      });
      if (schedule) {
        return preferredScheduleId;
      }
    }
  }
  
  // Fallback: Try to get latest published schedule
  const publishedSchedule = await prisma.schedule.findFirst({
    where: { name: 'Published' },
    orderBy: { updatedAt: 'desc' }
  });
  
  if (publishedSchedule) {
    return publishedSchedule.id;
  }
  
  // Final fallback: Get user's most recent schedule
  const userSchedule = await prisma.schedule.findFirst({
    where: { userId: userId },
    orderBy: { updatedAt: 'desc' }
  });
  
  if (!userSchedule) {
    throw new Error('No accessible schedule found for user');
  }
  
  return userSchedule.id;
};