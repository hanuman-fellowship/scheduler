import prisma from './prisma';
import type { UserRole } from '@shared/types';
import { z } from 'zod';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

export const getSchedulesForUser = async (user: AuthUser) => {
  // Only return in-progress schedules (user-owned, non-template, non-request)
  const mySchedules = await prisma.schedule.findMany({
    where: { 
      userId: user.id,
      template: false,
      request: 0
    },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      userId: true,
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
    // Only return in-progress schedules from all users (not published, not templates)
    const allSchedules = await prisma.schedule.findMany({
      where: {
        userId: { not: null }, // Exclude published schedules (userId = null)
        template: false,
        request: 0
      },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        name: true,
        userId: true,
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

// Schema for schedule copying
export const CopyScheduleSchema = z.object({
  name: z.string().min(1, 'Schedule name is required'),
  sourceId: z.number().int().positive('Valid source schedule ID is required'),
  copyType: z.enum(['full', 'structure', 'template']).default('full'),
});

// Schema for template creation
export const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  sourceId: z.number().int().positive('Valid source schedule ID is required'),
});

// Schema for publishing
export const PublishScheduleSchema = z.object({
  scheduleId: z.number().int().positive('Valid schedule ID is required'),
  groupName: z.string().min(1, 'Group name is required'),
  startDate: z.string().datetime('Valid start date is required'),
  endDate: z.string().datetime('Valid end date is required'),
  groupType: z.enum(['new', 'existing']).default('new'),
  existingGroupId: z.number().int().positive().optional(),
});

// Copy a schedule with various options
export async function copySchedule(
  userId: number, 
  data: z.infer<typeof CopyScheduleSchema>
): Promise<{ id: number; name: string }> {
  const validatedData = CopyScheduleSchema.parse(data);
  
  // Get the source schedule
  const sourceSchedule = await prisma.schedule.findUnique({
    where: { id: validatedData.sourceId },
    include: {
      areas: true,
      days: true,
      shifts: {
        include: {
          assignments: true
        }
      },
      residentCategories: true,
      peopleSchedules: true
    }
  });
  
  if (!sourceSchedule) {
    throw new Error('Source schedule not found');
  }
  
  // Check for unique schedule name for this user
  const existingSchedule = await prisma.schedule.findFirst({
    where: {
      userId: userId,
      name: validatedData.name,
    }
  });
  
  if (existingSchedule) {
    throw new Error('A schedule with this name already exists');
  }
  
  // Create the new schedule
  const newSchedule = await prisma.schedule.create({
    data: {
      name: validatedData.name,
      userId: userId,
      request: 0, // regular schedule
      template: false,
      parentId: sourceSchedule.parentId || validatedData.sourceId, // maintain parent relationship
    }
  });
  
  // Copy areas
  const areaIdMap = new Map<number, number>();
  for (const area of sourceSchedule.areas) {
    const newArea = await prisma.area.create({
      data: {
        scheduleId: newSchedule.id,
        name: area.name,
        shortName: area.shortName,
        notes: area.notes
      }
    });
    areaIdMap.set(area.id, newArea.id);
  }
  
  // Copy days
  const dayIdMap = new Map<number, number>();
  for (const day of sourceSchedule.days) {
    const newDay = await prisma.day.create({
      data: {
        scheduleId: newSchedule.id,
        name: day.name,
        dayOfWeek: day.dayOfWeek
      }
    });
    dayIdMap.set(day.id, newDay.id);
  }
  
  // Copy resident categories
  const categoryIdMap = new Map<number, number>();
  for (const category of sourceSchedule.residentCategories) {
    const newCategory = await prisma.residentCategory.create({
      data: {
        scheduleId: newSchedule.id,
        name: category.name,
        color: category.color,
        sortOrder: category.sortOrder
      }
    });
    categoryIdMap.set(category.id, newCategory.id);
  }
  
  // Copy people schedule relationships (if full copy)
  if (validatedData.copyType === 'full') {
    for (const peopleSchedule of sourceSchedule.peopleSchedules) {
      const newCategoryId = categoryIdMap.get(peopleSchedule.residentCategoryId);
      if (newCategoryId) {
        await prisma.peopleSchedule.create({
          data: {
            scheduleId: newSchedule.id,
            personId: peopleSchedule.personId,
            residentCategoryId: newCategoryId
          }
        });
      }
    }
  }
  
  // Copy shifts and assignments (if not structure-only)
  if (validatedData.copyType !== 'structure') {
    for (const shift of sourceSchedule.shifts) {
      const newAreaId = areaIdMap.get(shift.areaId);
      const newDayId = dayIdMap.get(shift.dayId);
      
      if (newAreaId && newDayId) {
        const newShift = await prisma.shift.create({
          data: {
            scheduleId: newSchedule.id,
            areaId: newAreaId,
            dayId: newDayId,
            startAtSeconds: shift.startAtSeconds,
            endAtSeconds: shift.endAtSeconds,
            numPeople: shift.numPeople,
          }
        });
        
        // Copy assignments (if full copy)
        if (validatedData.copyType === 'full') {
          for (const assignment of shift.assignments) {
            await prisma.assignment.create({
              data: {
                scheduleId: newSchedule.id,
                shiftId: newShift.id,
                personId: assignment.personId,
                name: assignment.name,
                star: assignment.star,
              }
            });
          }
        }
      }
    }
  }
  
  return {
    id: newSchedule.id,
    name: newSchedule.name
  };
}

// Create a template from an existing schedule
export async function createTemplate(
  userId: number,
  data: z.infer<typeof CreateTemplateSchema>
): Promise<{ id: number; name: string }> {
  const validatedData = CreateTemplateSchema.parse(data);
  
  // Copy the schedule as structure-only and mark as template
  const copyResult = await copySchedule(userId, {
    name: validatedData.name,
    sourceId: validatedData.sourceId,
    copyType: 'structure'
  });
  
  // Update the copied schedule to be a template
  await prisma.schedule.update({
    where: { id: copyResult.id },
    data: {
      template: true,
      userId: null, // Templates are system-owned
      parentId: null // Templates have no parent
    }
  });
  
  return copyResult;
}

// Get all available templates
export async function getTemplates(): Promise<Array<{
  id: number;
  name: string;
  createdAt: string;
}>> {
  const templates = await prisma.schedule.findMany({
    where: { template: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  });
  
  return templates.map(template => ({
    ...template,
    createdAt: template.createdAt.toISOString()
  }));
}

// Publish a schedule to a schedule group
export async function publishSchedule(
  data: z.infer<typeof PublishScheduleSchema>
): Promise<{ groupId: number; scheduleId: number }> {
  const validatedData = PublishScheduleSchema.parse(data);
  
  const schedule = await prisma.schedule.findUnique({
    where: { id: validatedData.scheduleId }
  });
  
  if (!schedule) {
    throw new Error('Schedule not found');
  }
  
  let scheduleGroupId: number;
  
  if (validatedData.groupType === 'existing' && validatedData.existingGroupId) {
    scheduleGroupId = validatedData.existingGroupId;
  } else {
    // Create new schedule group
    const scheduleGroup = await prisma.scheduleGroup.create({
      data: {
        name: validatedData.groupName,
        start: new Date(validatedData.startDate),
        end: new Date(validatedData.endDate)
      }
    });
    scheduleGroupId = scheduleGroup.id;
  }
  
  // Update the schedule to be published
  await prisma.schedule.update({
    where: { id: validatedData.scheduleId },
    data: {
      name: 'Published',
      userId: null, // Published schedules are system-owned
      scheduleGroupId: scheduleGroupId,
      request: 0 // ensure it's not a request
    }
  });
  
  return {
    groupId: scheduleGroupId,
    scheduleId: validatedData.scheduleId
  };
}

// Get all schedule groups with their schedules
export async function getScheduleGroups(): Promise<Array<{
  id: number;
  name: string;
  start: string;
  end: string;
  schedules: Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;
}>> {
  const groups = await prisma.scheduleGroup.findMany({
    include: {
      schedules: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          createdAt: true
        }
      }
    },
    orderBy: { start: 'desc' }
  });
  
  return groups.map(group => ({
    id: group.id,
    name: group.name,
    start: group.start.toISOString(),
    end: group.end.toISOString(),
    schedules: group.schedules.map(schedule => ({
      ...schedule,
      createdAt: schedule.createdAt.toISOString()
    }))
  }));
}

// Get all published schedules
export async function getPublishedSchedules() {
  try {
    console.log('Service: Fetching published schedules from database...');
    const publishedSchedules = await prisma.schedule.findMany({
      where: {
        userId: null // Published schedules have no owner
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log('Service: Found schedules:', publishedSchedules.length);
    
    const result = publishedSchedules.map(schedule => ({
      id: schedule.id,
      name: schedule.name,
      userId: schedule.userId,
      request: schedule.request,
      template: schedule.template,
      createdAt: schedule.createdAt.toISOString(),
      updatedAt: schedule.updatedAt.toISOString()
    }));
    
    console.log('Service: Mapped result:', result);
    return result;
  } catch (error) {
    console.error('Service: Error in getPublishedSchedules:', error);
    throw error;
  }
}

// Get published schedules (current active one)
export async function getPublishedSchedule(): Promise<{
  id: number;
  name: string;
  groupName: string;
  startDate: string;
  endDate: string;
} | null> {
  const now = new Date();
  
  // Find the schedule group that contains the current date
  const activeGroup = await prisma.scheduleGroup.findFirst({
    where: {
      start: { lte: now },
      end: { gte: now }
    },
    include: {
      schedules: {
        take: 1,
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  
  if (!activeGroup || activeGroup.schedules.length === 0) {
    return null;
  }
  
  const schedule = activeGroup.schedules[0];
  
  return {
    id: schedule.id,
    name: schedule.name,
    groupName: activeGroup.name,
    startDate: activeGroup.start.toISOString(),
    endDate: activeGroup.end.toISOString()
  };
}