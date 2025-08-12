import prisma from './prisma';
import { z } from 'zod';

export const CreatePersonSchema = z.object({
  first: z.string().min(1, 'First name is required'),
  last: z.string().min(1, 'Last name is required'),
  displayName: z.string().optional(),
  residentCategoryId: z.number().int().positive('Valid category is required'),
  scheduleId: z.number().int().positive('Schedule ID is required'),
});

export const UpdatePersonSchema = CreatePersonSchema.partial();

export interface Person {
  id: number;
  first: string;
  last: string;
  displayName: string;
  category?: {
    id: number;
    name: string;
    color: string;
  };
}

export async function getAllPeople(): Promise<Person[]> {
  const people = await prisma.person.findMany({
    include: {
      peopleSchedules: {
        include: {
          residentCategory: true,
        },
      },
    },
    orderBy: { first: 'asc' },
  });

  return people.map(transformPersonResponse);
}

export async function getPersonById(id: number): Promise<Person | null> {
  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      peopleSchedules: {
        include: {
          residentCategory: true,
        },
      },
    },
  });

  return person ? transformPersonResponse(person) : null;
}

export async function createPerson(data: z.infer<typeof CreatePersonSchema>): Promise<Person> {
  const validatedData = CreatePersonSchema.parse(data);
  
  // Generate display name if not provided
  let displayName = validatedData.displayName;
  if (!displayName) {
    displayName = await generateDisplayName(validatedData.first, validatedData.last);
  }

  const person = await prisma.person.create({
    data: {
      first: validatedData.first,
      last: validatedData.last,
      displayName: displayName,
    },
  });

  // Create the people schedule relationship
  if (validatedData.residentCategoryId) {
    await prisma.peopleSchedule.create({
      data: {
        personId: person.id,
        residentCategoryId: validatedData.residentCategoryId,
        scheduleId: validatedData.scheduleId,
      },
    });
  }

  // Reload the person with relationships to get the category data
  const personWithRelations = await prisma.person.findUnique({
    where: { id: person.id },
    include: {
      peopleSchedules: {
        include: {
          residentCategory: true,
        },
      },
    },
  });

  return transformPersonResponse(personWithRelations!);
}

export async function updatePerson(id: number, data: z.infer<typeof UpdatePersonSchema>): Promise<Person | null> {
  const validatedData = UpdatePersonSchema.parse(data);
  
  const existing = await prisma.person.findUnique({ where: { id } });
  if (!existing) return null;

  const updateData: any = {};
  
  if (validatedData.first !== undefined) updateData.first = validatedData.first;
  if (validatedData.last !== undefined) updateData.last = validatedData.last;
  if (validatedData.displayName !== undefined) updateData.displayName = validatedData.displayName;

  const person = await prisma.person.update({
    where: { id },
    data: updateData,
    include: {
      peopleSchedules: {
        include: {
          residentCategory: true,
        },
      },
    },
  });

  // Update category if provided
  if (validatedData.residentCategoryId) {
    await prisma.peopleSchedule.updateMany({
      where: { personId: id },
      data: { residentCategoryId: validatedData.residentCategoryId },
    });
  }

  return transformPersonResponse(person);
}

export async function deletePerson(id: number): Promise<boolean> {
  const existing = await prisma.person.findUnique({ where: { id } });
  if (!existing) return false;

  await prisma.person.delete({ where: { id } });
  return true;
}

// Helper functions
async function generateDisplayName(first: string, last: string): Promise<string> {
  const conflictingPeople = await prisma.person.findMany({
    where: { first },
    select: { displayName: true, last: true },
  });

  if (conflictingPeople.length === 0) {
    return first;
  }

  // Simple conflict resolution - add first letter of last name
  return `${first} ${last.charAt(0)}`;
}

function transformPersonResponse(person: any): Person {
  return {
    id: person.id,
    first: person.first,
    last: person.last,
    displayName: person.displayName,
    category: person.peopleSchedules[0]?.residentCategory ? {
      id: person.peopleSchedules[0].residentCategory.id,
      name: person.peopleSchedules[0].residentCategory.name,
      color: person.peopleSchedules[0].residentCategory.color,
    } : undefined,
  };
}