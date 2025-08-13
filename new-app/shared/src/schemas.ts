import { z } from 'zod'

// Assignment schemas
export const createAssignmentRequestSchema = z.object({
  shiftId: z.number().int().positive(),
  personId: z.number().int().positive().nullable(), // null for "other"
  name: z.string().optional(), // required if personId = null
}).refine(data => {
  if (data.personId === null && (!data.name || data.name.trim() === '')) {
    return false;
  }
  return true;
}, {
  message: "Name is required when personId is null",
  path: ["name"]
});

export const updateAssignmentRequestSchema = z.object({
  personId: z.number().int().positive().nullable().optional(),
  name: z.string().optional(),
  star: z.boolean().optional(),
});

export const assignmentIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Shift schemas
export const createShiftRequestSchema = z.object({
  areaId: z.number().int().positive(),
  dayId: z.number().int().positive(),
  startAtSeconds: z.number().int().min(0).max(86399),
  endAtSeconds: z.number().int().min(0).max(86399),
  numPeople: z.number().int().positive(),
}).refine(data => data.endAtSeconds > data.startAtSeconds, {
  message: "End time must be after start time",
  path: ["endAtSeconds"]
});

export const updateShiftRequestSchema = z.object({
  areaId: z.number().int().positive().optional(),
  dayId: z.number().int().positive().optional(),
  startAtSeconds: z.number().int().min(0).max(86399).optional(),
  endAtSeconds: z.number().int().min(0).max(86399).optional(),
  numPeople: z.number().int().positive().optional(),
});

export const shiftIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// User schemas
export const createUserRequestSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  roles: z.array(z.enum(['operations', 'manager', 'personnel'])),
  areaIds: z.array(z.number().int().positive()).optional(),
});

export const updateUserRequestSchema = z.object({
  username: z.string().min(1).optional(),
  password: z.string().min(1).optional(),
  roles: z.array(z.enum(['operations', 'manager', 'personnel'])).optional(),
  areaIds: z.array(z.number().int().positive()).optional(),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Category schemas
export const createCategoryRequestSchema = z.object({
  name: z.string().min(1),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const updateCategoryRequestSchema = z.object({
  name: z.string().min(1).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

export const categoryIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Area schemas
export const createAreaRequestSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1).max(10),
});

export const updateAreaRequestSchema = z.object({
  name: z.string().min(1).optional(),
  shortName: z.string().min(1).max(10).optional(),
});

export const areaIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// People schemas
export const createPersonRequestSchema = z.object({
  first: z.string().min(1),
  last: z.string().min(1),
  displayName: z.string().optional(),
  categoryId: z.number().int().positive(),
});

export const updatePersonRequestSchema = z.object({
  first: z.string().min(1).optional(),
  last: z.string().min(1).optional(),
  displayName: z.string().optional(),
  categoryId: z.number().int().positive().optional(),
});

export const personIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});