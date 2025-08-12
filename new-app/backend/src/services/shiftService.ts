import prisma from './prisma';
import { z } from 'zod';

export const CreateShiftSchema = z.object({
  areaId: z.number().int().positive('Valid area is required'),
  dayId: z.number().int().positive('Valid day is required'),
  startAtSeconds: z.number().int().min(0).max(86399, 'Start time must be between 0-86399 seconds'),
  endAtSeconds: z.number().int().min(0).max(86399, 'End time must be between 0-86399 seconds'),
  numPeople: z.number().int().min(1, 'Must have at least 1 person'),
  scheduleId: z.number().int().positive('Schedule ID is required'),
});

export const UpdateShiftSchema = CreateShiftSchema.partial().omit({ scheduleId: true });

export interface Shift {
  id: number;
  scheduleId: number;
  areaId: number;
  dayId: number;
  startAtSeconds: number;
  endAtSeconds: number;
  numPeople: number;
  area?: {
    id: number;
    name: string;
    shortName: string;
  };
  day?: {
    id: number;
    name: string;
    dayOfWeek: number;
  };
  assignments?: {
    id: number;
    personId: number;
    name: string | null;
    star: boolean;
  }[];
}

export async function getAllShifts(scheduleId: number): Promise<Shift[]> {
  const shifts = await prisma.shift.findMany({
    where: { scheduleId },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      day: {
        select: {
          id: true,
          name: true,
          dayOfWeek: true,
        },
      },
      assignments: {
        select: {
          id: true,
          personId: true,
          name: true,
          star: true,
        },
      },
    },
    orderBy: [
      { day: { dayOfWeek: 'asc' } },
      { startAtSeconds: 'asc' },
    ],
  });

  return shifts.map(transformShiftResponse);
}

export async function getShiftById(id: number): Promise<Shift | null> {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      day: {
        select: {
          id: true,
          name: true,
          dayOfWeek: true,
        },
      },
      assignments: {
        select: {
          id: true,
          personId: true,
          name: true,
          star: true,
        },
      },
    },
  });

  return shift ? transformShiftResponse(shift) : null;
}

export async function getShiftsByArea(areaId: number, scheduleId: number): Promise<Shift[]> {
  const shifts = await prisma.shift.findMany({
    where: { 
      areaId,
      scheduleId,
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      day: {
        select: {
          id: true,
          name: true,
          dayOfWeek: true,
        },
      },
      assignments: {
        select: {
          id: true,
          personId: true,
          name: true,
          star: true,
        },
      },
    },
    orderBy: [
      { day: { dayOfWeek: 'asc' } },
      { startAtSeconds: 'asc' },
    ],
  });

  return shifts.map(transformShiftResponse);
}

export async function createShift(data: z.infer<typeof CreateShiftSchema>): Promise<Shift> {
  const validatedData = CreateShiftSchema.parse(data);
  
  // Validate that end time is after start time
  if (validatedData.endAtSeconds <= validatedData.startAtSeconds) {
    throw new Error("End time must be after start time");
  }

  // Validate that area and day exist and belong to the same schedule
  const area = await prisma.area.findUnique({
    where: { id: validatedData.areaId },
    select: { scheduleId: true },
  });

  const day = await prisma.day.findUnique({
    where: { id: validatedData.dayId },
    select: { scheduleId: true },
  });

  if (!area || !day) {
    throw new Error("Invalid area or day");
  }

  if (area.scheduleId !== validatedData.scheduleId || day.scheduleId !== validatedData.scheduleId) {
    throw new Error("Area and day must belong to the same schedule");
  }

  const shift = await prisma.shift.create({
    data: {
      scheduleId: validatedData.scheduleId,
      areaId: validatedData.areaId,
      dayId: validatedData.dayId,
      startAtSeconds: validatedData.startAtSeconds,
      endAtSeconds: validatedData.endAtSeconds,
      numPeople: validatedData.numPeople,
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      day: {
        select: {
          id: true,
          name: true,
          dayOfWeek: true,
        },
      },
      assignments: {
        select: {
          id: true,
          personId: true,
          name: true,
          star: true,
        },
      },
    },
  });

  return transformShiftResponse(shift);
}

export async function updateShift(id: number, data: z.infer<typeof UpdateShiftSchema>): Promise<Shift | null> {
  const validatedData = UpdateShiftSchema.parse(data);
  
  const existing = await prisma.shift.findUnique({ 
    where: { id },
    include: {
      assignments: {
        select: { id: true },
      },
    },
  });
  
  if (!existing) return null;

  // If updating numPeople, ensure it's not less than current assignments
  if (validatedData.numPeople !== undefined) {
    const numAssigned = existing.assignments.length;
    if (validatedData.numPeople < numAssigned) {
      throw new Error("Too many people already assigned");
    }
  }

  // Validate time ordering if both start and end are provided
  const startAtSeconds = validatedData.startAtSeconds || existing.startAtSeconds;
  const endAtSeconds = validatedData.endAtSeconds || existing.endAtSeconds;
  if (endAtSeconds <= startAtSeconds) {
    throw new Error("End time must be after start time");
  }

  const updateData: any = {};
  if (validatedData.areaId !== undefined) updateData.areaId = validatedData.areaId;
  if (validatedData.dayId !== undefined) updateData.dayId = validatedData.dayId;
  if (validatedData.startAtSeconds !== undefined) updateData.startAtSeconds = validatedData.startAtSeconds;
  if (validatedData.endAtSeconds !== undefined) updateData.endAtSeconds = validatedData.endAtSeconds;
  if (validatedData.numPeople !== undefined) updateData.numPeople = validatedData.numPeople;

  const shift = await prisma.shift.update({
    where: { id },
    data: updateData,
    include: {
      area: {
        select: {
          id: true,
          name: true,
          shortName: true,
        },
      },
      day: {
        select: {
          id: true,
          name: true,
          dayOfWeek: true,
        },
      },
      assignments: {
        select: {
          id: true,
          personId: true,
          name: true,
          star: true,
        },
      },
    },
  });

  return transformShiftResponse(shift);
}

export async function deleteShift(id: number): Promise<boolean> {
  const existing = await prisma.shift.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.shift.delete({ where: { id } });
  return true;
}

// Helper functions
function transformShiftResponse(shift: any): Shift {
  return {
    id: shift.id,
    scheduleId: shift.scheduleId,
    areaId: shift.areaId,
    dayId: shift.dayId,
    startAtSeconds: shift.startAtSeconds,
    endAtSeconds: shift.endAtSeconds,
    numPeople: shift.numPeople,
    area: shift.area ? {
      id: shift.area.id,
      name: shift.area.name,
      shortName: shift.area.shortName,
    } : undefined,
    day: shift.day ? {
      id: shift.day.id,
      name: shift.day.name,
      dayOfWeek: shift.day.dayOfWeek,
    } : undefined,
    assignments: shift.assignments || [],
  };
}