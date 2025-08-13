import prisma from './prisma'
import type { CreateAssignmentRequest, AssignmentResponse, AssignmentWithShiftResponse } from '@shared/types'

export interface CreateAssignmentWithScheduleRequest extends CreateAssignmentRequest {
  scheduleId: number;
}

export interface UpdateAssignmentRequest {
  personId?: number | null;
  name?: string;
  star?: boolean;
}

export async function createAssignment(data: CreateAssignmentWithScheduleRequest): Promise<AssignmentResponse> {
  // Validate shift exists and has capacity
  const shift = await prisma.shift.findUnique({
    where: { id: data.shiftId },
    include: {
      assignments: true,
    },
  });

  if (!shift) {
    throw new Error('Shift not found');
  }

  if (shift.assignments.length >= shift.numPeople) {
    throw new Error('Shift is already full');
  }

  // For "other" assignments, ensure name is provided
  if (data.personId === null && (!data.name || data.name.trim() === '')) {
    throw new Error('Name is required for "other" assignments');
  }

  // Check for duplicate assignment (same person, same shift)
  if (data.personId !== null) {
    const existingAssignment = await prisma.assignment.findFirst({
      where: {
        shiftId: data.shiftId,
        personId: data.personId,
      },
    });

    if (existingAssignment) {
      throw new Error('Person is already assigned to this shift');
    }
  }

  const assignment = await prisma.assignment.create({
    data: {
      scheduleId: data.scheduleId,
      shiftId: data.shiftId,
      personId: data.personId,
      name: data.personId === null ? data.name : null,
      star: false,
    },
    include: {
      person: {
        select: {
          id: true,
          first: true,
          last: true,
          displayName: true,
        },
      },
    },
  });

  return {
    id: assignment.id,
    shiftId: assignment.shiftId,
    personId: assignment.personId,
    name: assignment.name || undefined,
    star: assignment.star,
    person: assignment.personId !== null ? {
      id: assignment.person!.id,
      first: assignment.person!.first,
      last: assignment.person!.last,
      displayName: assignment.person!.displayName || undefined,
    } : undefined,
  };
}

export async function updateAssignment(id: number, data: UpdateAssignmentRequest): Promise<AssignmentResponse | null> {
  const existing = await prisma.assignment.findUnique({
    where: { id },
    include: {
      shift: {
        include: { assignments: true },
      },
    },
  });

  if (!existing) {
    return null;
  }

  // If changing person, validate new person and check for duplicates
  if (data.personId !== undefined && data.personId !== existing.personId) {
    if (data.personId !== null) {
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          shiftId: existing.shiftId,
          personId: data.personId,
          id: { not: id }, // Exclude current assignment
        },
      });

      if (existingAssignment) {
        throw new Error('Person is already assigned to this shift');
      }
    }
  }

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      personId: data.personId,
      name: data.personId === null ? data.name : undefined,
      star: data.star,
    },
    include: {
      person: {
        select: {
          id: true,
          first: true,
          last: true,
          displayName: true,
        },
      },
    },
  });

  return {
    id: assignment.id,
    shiftId: assignment.shiftId,
    personId: assignment.personId,
    name: assignment.name || undefined,
    star: assignment.star,
    person: assignment.personId !== null ? {
      id: assignment.person!.id,
      first: assignment.person!.first,
      last: assignment.person!.last,
      displayName: assignment.person!.displayName || undefined,
    } : undefined,
  };
}

export async function deleteAssignment(id: number): Promise<boolean> {
  try {
    await prisma.assignment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function toggleAssignmentStar(id: number): Promise<AssignmentResponse | null> {
  const existing = await prisma.assignment.findUnique({
    where: { id },
  });

  if (!existing) {
    return null;
  }

  const assignment = await prisma.assignment.update({
    where: { id },
    data: {
      star: !existing.star, // Toggle star status
    },
    include: {
      person: {
        select: {
          id: true,
          first: true,
          last: true,
          displayName: true,
        },
      },
    },
  });

  return {
    id: assignment.id,
    shiftId: assignment.shiftId,
    personId: assignment.personId,
    name: assignment.name || undefined,
    star: assignment.star,
    person: assignment.personId !== null ? {
      id: assignment.person!.id,
      first: assignment.person!.first,
      last: assignment.person!.last,
      displayName: assignment.person!.displayName || undefined,
    } : undefined,
  };
}

export async function getAvailablePeopleForShift(shiftId: number): Promise<Array<{
  id: number;
  name: string;
  displayName?: string;
  category: {
    id: number;
    name: string;
    color: string;
  };
  available: boolean;
  conflictReason?: string;
}>> {
  const shift = await prisma.shift.findUnique({
    where: { id: shiftId },
    include: {
      day: true,
      schedule: true,
    },
  });

  if (!shift) {
    throw new Error('Shift not found');
  }

  // Get all people for this schedule
  const people = await prisma.person.findMany({
    include: {
      peopleSchedules: {
        where: { scheduleId: shift.scheduleId },
        include: {
          residentCategory: true,
        },
      },
      assignments: {
        where: {
          shift: {
            scheduleId: shift.scheduleId,
            dayId: shift.dayId,
          },
        },
        include: {
          shift: true,
        },
      },
      offDays: {
        where: {
          scheduleId: shift.scheduleId,
          dayId: shift.dayId,
        },
      },
    },
  });

  return people
    .filter(person => person.peopleSchedules.length > 0) // Only people in this schedule
    .map(person => {
      const personSchedule = person.peopleSchedules[0];
      const conflicts: string[] = [];
      let available = true;

      // Check for off days
      if (person.offDays.length > 0) {
        conflicts.push('Off day');
        available = false;
      }

      // Check for time conflicts (overlapping shifts on same day)
      person.assignments.forEach(assignment => {
        const assignmentShift = assignment.shift;
        
        // Skip if it's the same shift
        if (assignmentShift.id === shiftId) {
          return;
        }

        // Check for time overlap
        const shiftStart = shift.startAtSeconds;
        const shiftEnd = shift.endAtSeconds;
        const assignmentStart = assignmentShift.startAtSeconds;
        const assignmentEnd = assignmentShift.endAtSeconds;

        if (
          (shiftStart < assignmentEnd && shiftEnd > assignmentStart) // Time overlap
        ) {
          conflicts.push(`Conflicts with ${assignmentStart}-${assignmentEnd}`);
          available = false;
        }
      });

      // Check if already assigned to this exact shift
      const alreadyAssigned = person.assignments.some(a => a.shiftId === shiftId);
      if (alreadyAssigned) {
        conflicts.push('Already assigned');
        available = false;
      }

      return {
        id: person.id,
        name: `${person.first} ${person.last}`,
        displayName: person.displayName || undefined,
        category: {
          id: personSchedule.residentCategory.id,
          name: personSchedule.residentCategory.name,
          color: personSchedule.residentCategory.color || '#000000'
        },
        available,
        conflictReason: conflicts.length > 0 ? conflicts.join(', ') : undefined,
      };
    });
}

export async function getShiftAssignments(shiftId: number): Promise<AssignmentResponse[]> {
  const assignments = await prisma.assignment.findMany({
    where: { shiftId },
    include: {
      person: {
        select: {
          id: true,
          first: true,
          last: true,
          displayName: true,
        },
      },
    },
    orderBy: [
      { star: 'desc' }, // Starred assignments first
      { person: { first: 'asc' } }, // Then by first name
    ],
  });

  return assignments.map(assignment => ({
    id: assignment.id,
    shiftId: assignment.shiftId,
    personId: assignment.personId,
    name: assignment.name || undefined,
    star: assignment.star,
    person: assignment.personId !== null ? {
      id: assignment.person!.id,
      first: assignment.person!.first,
      last: assignment.person!.last,
      displayName: assignment.person!.displayName || undefined,
    } : undefined,
  }));
}