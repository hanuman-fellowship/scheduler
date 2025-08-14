import prisma from './prisma';
import { z } from 'zod';

// Request creation and template selection
export const CreateRequestSchema = z.object({
  name: z.string().min(1, 'Request name is required'),
  areaId: z.number().int().positive('Valid area is required'),
  baseType: z.enum(['published', 'template', 'request', 'blank']),
  baseScheduleId: z.number().int().positive().optional(), // Required when baseType is not 'blank'
});

export const SubmitRequestSchema = z.object({
  requestId: z.number().int().positive('Valid request ID is required'),
});

export interface RequestSummary {
  id: number;
  name: string;
  areaId: number;
  areaName: string;
  managerName: string;
  submittedAt: string;
  request: 1; // Only submitted requests
}

export interface RequestsByArea {
  [areaName: string]: {
    areaName: string;
    requests: RequestSummary[];
  };
}

// Create a new draft request for a manager
export async function createRequest(
  managerId: number, 
  data: z.infer<typeof CreateRequestSchema>
): Promise<{ id: number; name: string }> {
  const validatedData = CreateRequestSchema.parse(data);
  
  // Verify manager has permission for this area
  await verifyManagerPermission(managerId, validatedData.areaId);
  
  // Check for unique request name for this manager
  const existingRequest = await prisma.schedule.findFirst({
    where: {
      userId: managerId,
      name: validatedData.name,
      request: { in: [1, 2] } // submitted or draft
    }
  });
  
  if (existingRequest) {
    throw new Error('A request with this name already exists');
  }
  
  // Create the new request schedule
  const newRequest = await prisma.schedule.create({
    data: {
      name: validatedData.name,
      userId: managerId,
      request: 2, // draft
      template: false,
    }
  });
  
  // Create the area for the request (copy area info)
  const sourceArea = await prisma.area.findUnique({
    where: { id: validatedData.areaId }
  });
  
  if (sourceArea) {
    await prisma.area.create({
      data: {
        scheduleId: newRequest.id,
        name: sourceArea.name,
        shortName: sourceArea.shortName,
        notes: sourceArea.notes
      }
    });
  }
  
  // Copy data from base schedule if specified
  if (validatedData.baseType !== 'blank' && validatedData.baseScheduleId) {
    await copyScheduleData(validatedData.baseScheduleId, newRequest.id, validatedData.areaId);
  }
  
  return {
    id: newRequest.id,
    name: newRequest.name
  };
}

// Get all draft requests for a manager
export async function getManagerDraftRequests(managerId: number): Promise<Array<{
  id: number;
  name: string;
  areaName: string;
  createdAt: string;
}>> {
  const requests = await prisma.schedule.findMany({
    where: {
      userId: managerId,
      request: 2 // draft only
    },
    include: {
      areas: {
        take: 1, // Get first area to determine which area this request is for
        select: {
          name: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' }
  });
  
  return requests.map(req => ({
    id: req.id,
    name: req.name,
    areaName: req.areas[0]?.name || 'Unknown Area',
    createdAt: req.createdAt.toISOString()
  }));
}

// Submit a draft request (change state from 2 to 1)
export async function submitRequest(managerId: number, requestId: number): Promise<string> {
  // Verify the request belongs to this manager and is in draft state
  const request = await prisma.schedule.findFirst({
    where: {
      id: requestId,
      userId: managerId,
      request: 2 // must be draft
    }
  });
  
  if (!request) {
    throw new Error('Request not found or already submitted');
  }
  
  // Change state to submitted
  await prisma.schedule.update({
    where: { id: requestId },
    data: { 
      request: 1, // submitted
      updatedAt: new Date() // Track submission time
    }
  });
  
  return request.name;
}

// Get all submitted requests for operations (grouped by area)
export async function getSubmittedRequests(): Promise<RequestsByArea> {
  const requests = await prisma.schedule.findMany({
    where: {
      request: 1 // submitted only
    },
    include: {
      user: {
        select: {
          username: true
        }
      },
      areas: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' } // Sort by submission time
  });
  
  const requestsByArea: RequestsByArea = {};
  
  requests.forEach(req => {
    const area = req.areas[0];
    if (!area) return;
    
    if (!requestsByArea[area.name]) {
      requestsByArea[area.name] = {
        areaName: area.name,
        requests: []
      };
    }
    
    requestsByArea[area.name].requests.push({
      id: req.id,
      name: req.name,
      areaId: area.id,
      areaName: area.name,
      managerName: req.user?.username || 'Unknown',
      submittedAt: req.updatedAt.toISOString(),
      request: 1
    });
  });
  
  return requestsByArea;
}

// Accept a request (merge into published schedule)
export async function acceptRequest(requestId: number, clearAreaFirst: boolean = true): Promise<string> {
  const request = await prisma.schedule.findFirst({
    where: {
      id: requestId,
      request: 1 // must be submitted
    },
    include: {
      areas: true,
      shifts: {
        include: {
          assignments: true
        }
      }
    }
  });
  
  if (!request) {
    throw new Error('Request not found or not in submitted state');
  }
  
  if (request.areas.length === 0) {
    throw new Error('Request has no associated area');
  }
  
  const areaId = request.areas[0].id;
  
  // Find the current published schedule
  const publishedSchedule = await prisma.schedule.findFirst({
    where: {
      request: 0, // published schedule
      userId: null // published schedules have no user
    }
  });
  
  if (!publishedSchedule) {
    throw new Error('No published schedule found');
  }
  
  // Clear existing shifts in this area if requested
  if (clearAreaFirst) {
    await prisma.assignment.deleteMany({
      where: {
        shift: {
          areaId: areaId,
          scheduleId: publishedSchedule.id
        }
      }
    });
    
    await prisma.shift.deleteMany({
      where: {
        areaId: areaId,
        scheduleId: publishedSchedule.id
      }
    });
  }
  
  // Copy all shifts from request to published schedule
  for (const shift of request.shifts) {
    const newShift = await prisma.shift.create({
      data: {
        scheduleId: publishedSchedule.id,
        areaId: shift.areaId,
        dayId: shift.dayId,
        startAtSeconds: shift.startAtSeconds,
        endAtSeconds: shift.endAtSeconds,
        numPeople: shift.numPeople,
      }
    });
    
    // Copy assignments
    for (const assignment of shift.assignments) {
      await prisma.assignment.create({
        data: {
          scheduleId: publishedSchedule.id,
          shiftId: newShift.id,
          personId: assignment.personId,
          name: assignment.name,
          star: assignment.star,
        }
      });
    }
  }
  
  // Delete the request schedule after successful merge
  await prisma.schedule.delete({
    where: { id: requestId }
  });
  
  return request.name;
}

// Delete a request (draft or submitted)
export async function deleteRequest(requestId: number, userId?: number): Promise<string> {
  // If userId provided, verify ownership (for managers)
  const whereClause: any = {
    id: requestId,
    request: { in: [1, 2] } // draft or submitted
  };
  
  if (userId) {
    whereClause.userId = userId; // Manager can only delete their own requests
  }
  
  const request = await prisma.schedule.findFirst({
    where: whereClause
  });
  
  if (!request) {
    throw new Error('Request not found or insufficient permissions');
  }
  
  // Delete the request (CASCADE will handle related data)
  await prisma.schedule.delete({
    where: { id: requestId }
  });
  
  return request.name;
}

// Helper function to verify manager permissions
async function verifyManagerPermission(managerId: number, areaId: number): Promise<void> {
  const managerArea = await prisma.manager.findFirst({
    where: {
      userId: managerId,
      areaId: areaId
    }
  });
  
  if (!managerArea) {
    throw new Error('You do not have permission to manage this area');
  }
}

// Helper function to copy schedule data (simplified version)
async function copyScheduleData(sourceScheduleId: number, targetScheduleId: number, filterAreaId?: number): Promise<void> {
  const sourceSchedule = await prisma.schedule.findUnique({
    where: { id: sourceScheduleId },
    include: {
      areas: true,
      days: true,
      shifts: {
        where: filterAreaId ? { areaId: filterAreaId } : undefined,
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
  
  // Copy areas (if filtering by area, copy only that area)
  const areasToCreate = filterAreaId 
    ? sourceSchedule.areas.filter(area => area.id === filterAreaId)
    : sourceSchedule.areas;
  
  const areaIdMap = new Map<number, number>();
  for (const area of areasToCreate) {
    const newArea = await prisma.area.create({
      data: {
        scheduleId: targetScheduleId,
        name: area.name,
        shortName: area.shortName
      }
    });
    areaIdMap.set(area.id, newArea.id);
  }
  
  // Copy days
  const dayIdMap = new Map<number, number>();
  for (const day of sourceSchedule.days) {
    const newDay = await prisma.day.create({
      data: {
        scheduleId: targetScheduleId,
        name: day.name,
        dayOfWeek: day.dayOfWeek
      }
    });
    dayIdMap.set(day.id, newDay.id);
  }
  
  // Copy resident categories (legacy behavior: always create new categories)
  const categoryIdMap = new Map<number, number>();
  for (const category of sourceSchedule.residentCategories) {
    const newCategory = await prisma.residentCategory.create({
      data: {
        scheduleId: targetScheduleId,
        name: category.name,
        color: category.color,
        sortOrder: category.sortOrder
      }
    });
    categoryIdMap.set(category.id, newCategory.id);
  }
  
  // Copy people schedule relationships
  for (const peopleSchedule of sourceSchedule.peopleSchedules) {
    const newCategoryId = categoryIdMap.get(peopleSchedule.residentCategoryId);
    if (newCategoryId) {
      await prisma.peopleSchedule.create({
        data: {
          scheduleId: targetScheduleId,
          personId: peopleSchedule.personId,
          residentCategoryId: newCategoryId
        }
      });
    }
  }
  
  // Copy shifts and assignments
  for (const shift of sourceSchedule.shifts) {
    const newAreaId = areaIdMap.get(shift.areaId);
    const newDayId = dayIdMap.get(shift.dayId);
    
    if (newAreaId && newDayId) {
      const newShift = await prisma.shift.create({
        data: {
          scheduleId: targetScheduleId,
          areaId: newAreaId,
          dayId: newDayId,
          startAtSeconds: shift.startAtSeconds,
          endAtSeconds: shift.endAtSeconds,
          numPeople: shift.numPeople,
        }
      });
      
      // Copy assignments
      for (const assignment of shift.assignments) {
        await prisma.assignment.create({
          data: {
            scheduleId: targetScheduleId,
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