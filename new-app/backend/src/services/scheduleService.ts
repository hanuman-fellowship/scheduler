import prisma from './prisma';
import type { UserRole } from '@shared/types';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

export const getSchedulesForUser = async (user: AuthUser) => {
  const mySchedules = await prisma.schedule.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      request: true,
      template: true,
      createdAt: true
    }
  });

  const response: any = {
    mine: mySchedules.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString()
    }))
  };

  if (user.roles.includes('operations')) {
    const allSchedules = await prisma.schedule.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        request: true,
        template: true,
        createdAt: true,
        user: {
          select: { username: true }
        }
      }
    });

    response.all = allSchedules.map(s => ({
      ...s,
      createdAt: s.createdAt.toISOString(),
      owner: s.user?.username || 'System'
    }));
  }

  return response;
};

export const getScheduleDetail = async (scheduleId: number, user: AuthUser) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      areas: true,
      days: true,
      peopleSchedules: {
        include: {
          person: true,
          residentCategory: true
        }
      }
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  // Allow access if: user owns the schedule, user is operations, or it's a published schedule (userId: null)
  if (schedule.userId !== null && schedule.userId !== user.id && !user.roles.includes('operations')) {
    throw new Error('Access denied');
  }

  return {
    id: schedule.id,
    name: schedule.name,
    userId: schedule.userId,
    template: schedule.template,
    request: schedule.request,
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
    areas: schedule.areas,
    days: schedule.days,
    people: schedule.peopleSchedules.map(ps => ({
      id: ps.person.id,
      first: ps.person.first,
      last: ps.person.last,
      name: ps.person.displayName || `${ps.person.first} ${ps.person.last.charAt(0)}`,
      category: {
        id: ps.residentCategory.id,
        name: ps.residentCategory.name,
        color: ps.residentCategory.color || '#gray'
      }
    }))
  };
};

export const deleteSchedule = async (scheduleId: number, user: AuthUser) => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  // Allow access if: user owns the schedule, user is operations, or it's a published schedule (userId: null)
  if (schedule.userId !== null && schedule.userId !== user.id && !user.roles.includes('operations')) {
    throw new Error('Access denied');
  }

  await prisma.schedule.delete({
    where: { id: scheduleId }
  });
};