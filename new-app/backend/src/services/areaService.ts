import prisma from './prisma';
import { z } from 'zod';

export const CreateAreaSchema = z.object({
  name: z.string().min(1, 'Area name is required'),
  shortName: z.string().min(1, 'Short name is required'),
  notes: z.string().optional(),
  scheduleId: z.number().int().positive('Schedule ID is required'),
});

export const UpdateAreaSchema = CreateAreaSchema.partial().omit({ scheduleId: true });

export interface Area {
  id: number;
  scheduleId: number;
  name: string;
  shortName: string;
  notes?: string;
}

export async function getAllAreas(scheduleId: number): Promise<Area[]> {
  const areas = await prisma.area.findMany({
    where: { scheduleId },
    orderBy: { name: 'asc' },
  });

  return areas.map(transformAreaResponse);
}

export async function getAreaById(id: number): Promise<Area | null> {
  const area = await prisma.area.findUnique({
    where: { id },
  });

  return area ? transformAreaResponse(area) : null;
}

export async function createArea(data: z.infer<typeof CreateAreaSchema>): Promise<Area> {
  const validatedData = CreateAreaSchema.parse(data);

  const area = await prisma.area.create({
    data: {
      scheduleId: validatedData.scheduleId,
      name: validatedData.name,
      shortName: validatedData.shortName,
      notes: validatedData.notes || null,
    },
  });

  return transformAreaResponse(area);
}

export async function updateArea(id: number, data: z.infer<typeof UpdateAreaSchema>): Promise<Area | null> {
  const validatedData = UpdateAreaSchema.parse(data);
  
  const existing = await prisma.area.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData: any = {};
  if (validatedData.name !== undefined) updateData.name = validatedData.name;
  if (validatedData.shortName !== undefined) updateData.shortName = validatedData.shortName;
  if (validatedData.notes !== undefined) updateData.notes = validatedData.notes;

  const area = await prisma.area.update({
    where: { id },
    data: updateData,
  });

  return transformAreaResponse(area);
}

export async function deleteArea(id: number): Promise<boolean> {
  const existing = await prisma.area.findUnique({ where: { id } });
  if (!existing) return false;

  // First clear all shifts in this area (following legacy behavior)
  await clearAreaShifts(id);
  
  // Then delete the area
  await prisma.area.delete({ where: { id } });
  return true;
}

export async function clearAreaShifts(areaId: number): Promise<void> {
  // Clear all assignments from shifts in this area first
  await prisma.assignment.deleteMany({
    where: {
      shift: {
        areaId: areaId
      }
    }
  });

  // Then delete all shifts in this area
  await prisma.shift.deleteMany({
    where: { areaId }
  });

  // Also clear floating shifts for this area
  await prisma.floatingShift.deleteMany({
    where: { areaId }
  });
}

export async function getAffectedSchedules(areaId: number): Promise<number[]> {
  const area = await prisma.area.findUnique({
    where: { id: areaId },
    select: { scheduleId: true }
  });
  
  return area ? [area.scheduleId] : [];
}

export async function getAreaShiftCount(areaId: number): Promise<{ shifts: number; floatingShifts: number; assignments: number }> {
  const [shifts, floatingShifts, assignments] = await Promise.all([
    prisma.shift.count({ where: { areaId } }),
    prisma.floatingShift.count({ where: { areaId } }),
    prisma.assignment.count({
      where: {
        shift: { areaId }
      }
    })
  ]);

  return { shifts, floatingShifts, assignments };
}

// Helper functions
function transformAreaResponse(area: any): Area {
  return {
    id: area.id,
    scheduleId: area.scheduleId,
    name: area.name,
    shortName: area.shortName,
    notes: area.notes,
  };
}