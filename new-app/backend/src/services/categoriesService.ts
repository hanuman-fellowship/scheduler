import prisma from './prisma';
import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color (e.g., #FF0000)'),
  scheduleId: z.number().int().positive('Schedule ID is required'),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export interface Category {
  id: number;
  name: string;
  color: string | null;
  scheduleId: number;
  sortOrder?: number | null;
}

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.residentCategory.findMany({
    orderBy: { name: 'asc' },
  });

  return categories;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const category = await prisma.residentCategory.findUnique({
    where: { id },
  });

  return category;
}

export async function createCategory(data: z.infer<typeof CreateCategorySchema>): Promise<Category> {
  const validatedData = CreateCategorySchema.parse(data);

  // Check for duplicate name
  await checkDuplicateName(validatedData.name);

  const category = await prisma.residentCategory.create({
    data: validatedData,
  });

  return category;
}

export async function updateCategory(id: number, data: z.infer<typeof UpdateCategorySchema>): Promise<Category | null> {
  const validatedData = UpdateCategorySchema.parse(data);
  
  const existing = await prisma.residentCategory.findUnique({ where: { id } });
  if (!existing) return null;

  // Check for duplicate name if name is being changed
  if (validatedData.name && validatedData.name !== existing.name) {
    await checkDuplicateName(validatedData.name, id);
  }

  const category = await prisma.residentCategory.update({
    where: { id },
    data: validatedData,
  });

  return category;
}

export async function deleteCategory(id: number): Promise<{ success: boolean; error?: string }> {
  const existing = await prisma.residentCategory.findUnique({
    where: { id },
    include: { peopleSchedules: true },
  });

  if (!existing) {
    return { success: false, error: 'Category not found' };
  }

  if (existing.peopleSchedules.length > 0) {
    return { success: false, error: 'Cannot delete category that has people assigned' };
  }

  await prisma.residentCategory.delete({ where: { id } });
  return { success: true };
}

// Helper functions
async function checkDuplicateName(name: string, excludeId?: number): Promise<void> {
  const existing = await prisma.residentCategory.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  if (existing) {
    throw new Error('Category name already exists');
  }
}