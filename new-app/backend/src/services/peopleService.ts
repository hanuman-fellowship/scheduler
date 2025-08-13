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
    sortOrder?: number;
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
  });

  // Sort by category sort order, then by first name
  const transformed = people.map(transformPersonResponse);
  return transformed.sort((a, b) => {
    // Sort by category sort order (nulls last)
    const aSort = a.category?.sortOrder ?? 999;
    const bSort = b.category?.sortOrder ?? 999;
    
    if (aSort !== bSort) {
      return aSort - bSort;
    }
    
    // Then by first name
    return a.first.localeCompare(b.first);
  });
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

// Retire person from current schedule (removes PeopleSchedule but keeps Person)
export async function retirePerson(personId: number, scheduleId: number): Promise<string> {
  const person = await prisma.person.findUnique({
    where: { id: personId },
  });

  if (!person) {
    throw new Error('Person not found');
  }

  // Remove from current schedule
  const deleted = await prisma.peopleSchedule.deleteMany({
    where: { 
      personId: personId,
      scheduleId: scheduleId
    },
  });

  if (deleted.count === 0) {
    throw new Error('Person not found in current schedule');
  }

  return `${person.first} ${person.last}`;
}

// Retire multiple people at once (bulk retirement)
export async function retireMultiplePeople(peopleIds: number[], scheduleId: number): Promise<string[]> {
  const retiredNames: string[] = [];
  
  for (const personId of peopleIds) {
    try {
      const name = await retirePerson(personId, scheduleId);
      retiredNames.push(name);
    } catch (error) {
      // Skip people that can't be retired but don't fail the whole operation
      console.warn(`Failed to retire person ${personId}:`, error);
    }
  }

  return retiredNames;
}

// Get list of people who can be restored (not in current schedule)
export async function getRestorablePeople(scheduleId: number): Promise<Person[]> {
  // Find all people who are NOT in the current schedule
  const people = await prisma.person.findMany({
    where: {
      peopleSchedules: {
        none: {
          scheduleId: scheduleId
        }
      }
    },
    orderBy: { first: 'asc' },
  });

  return people.map(person => ({
    id: person.id,
    first: person.first,
    last: person.last,
    displayName: person.displayName || `${person.first} ${person.last}`,
  }));
}

// Restore person to schedule with selected category
export async function restorePerson(personId: number, scheduleId: number, categoryId: number): Promise<string> {
  const person = await prisma.person.findUnique({
    where: { id: personId },
  });

  if (!person) {
    throw new Error('Person not found');
  }

  // Check if person is already in this schedule
  const existing = await prisma.peopleSchedule.findFirst({
    where: {
      personId: personId,
      scheduleId: scheduleId
    }
  });

  if (existing) {
    throw new Error('Person is already in this schedule');
  }

  // Add to schedule with selected category
  await prisma.peopleSchedule.create({
    data: {
      personId: personId,
      scheduleId: scheduleId,
      residentCategoryId: categoryId
    }
  });

  return `${person.first} ${person.last}`;
}

// Get people grouped by category (for retire/restore UI)
export async function getPeopleByCategory(): Promise<{[categoryId: number]: {
  category: { id: number; name: string; color: string; sortOrder: number };
  people: Person[];
}}> {
  const people = await getAllPeople();
  
  // Group by category
  const groupedPeople: {[categoryId: number]: {
    category: { id: number; name: string; color: string; sortOrder: number };
    people: Person[];
  }} = {};

  people.forEach(person => {
    if (person.category) {
      const categoryId = person.category.id;
      if (!groupedPeople[categoryId]) {
        groupedPeople[categoryId] = {
          category: {
            id: person.category.id,
            name: person.category.name,
            color: person.category.color,
            sortOrder: person.category.sortOrder || 999
          },
          people: []
        };
      }
      groupedPeople[categoryId].people.push(person);
    }
  });

  return groupedPeople;
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
      sortOrder: person.peopleSchedules[0].residentCategory.sortOrder,
    } : undefined,
  };
}