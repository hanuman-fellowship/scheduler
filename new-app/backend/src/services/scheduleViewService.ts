import prisma from './prisma';
import { getScheduleBounds, getCurrentScheduleId } from './scheduleBoundsService';
import type { UserRole, AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse, HoursByDay } from '@shared/types';

interface AuthUser {
  id: number;
  username: string;
  email: string;
  roles: UserRole[];
}

export const getAreaSchedule = async (areaId: number, user: AuthUser): Promise<AreaScheduleResponse> => {
  const scheduleId = await getCurrentScheduleId();
  
  const area = await prisma.area.findFirst({
    where: { 
      id: areaId,
      scheduleId: scheduleId
    },
    include: {
      shifts: {
        include: {
          assignments: {
            include: {
              person: true
            }
          },
          day: true
        },
        orderBy: [
          { day: { dayOfWeek: 'asc' } },
          { start: 'asc' }
        ]
      },
      floatingShifts: {
        include: {
          person: true
        }
      },
      managers: {
        include: {
          user: {
            select: {
              id: true,
              username: true
            }
          }
        }
      },
      managerNotes: {
        where: { scheduleId },
        orderBy: { id: 'asc' }
      }
    }
  });

  if (!area) {
    throw new Error('Area not found');
  }

  // Check permissions
  const editable = user.roles.includes('operations') || 
    area.managers.some(m => m.userId === user.id);

  if (!editable && !user.roles.includes('operations') && !user.roles.includes('personnel')) {
    throw new Error('Access denied');
  }

  const bounds = await getScheduleBounds(scheduleId);

  // Transform shifts to include assignments
  const shiftsWithAssignments = area.shifts.map(shift => ({
    id: shift.id,
    areaId: shift.areaId,
    dayId: shift.dayId,
    start: shift.start,
    end: shift.end,
    numPeople: shift.numPeople,
    assignments: shift.assignments.map(assignment => ({
      id: assignment.id,
      shiftId: assignment.shiftId,
      personId: assignment.personId,
      name: assignment.name || undefined,
      star: assignment.star,
      person: assignment.person ? {
        id: assignment.person.id,
        first: assignment.person.first,
        last: assignment.person.last,
        name: assignment.person.displayName || `${assignment.person.first} ${assignment.person.last.charAt(0)}`,
        category: {
          id: 0, // Will be populated from PeopleSchedule
          name: '',
          color: ''
        }
      } : undefined
    }))
  }));

  return {
    area: {
      id: area.id,
      name: area.name,
      shortName: area.shortName,
      shifts: shiftsWithAssignments,
      floatingShifts: area.floatingShifts.map(fs => ({
        id: fs.id,
        areaId: fs.areaId,
        personId: fs.personId,
        hours: Number(fs.hours)
      })),
      manager: area.managers[0]?.user
    },
    bounds,
    editable,
    notes: area.managerNotes[0]?.content
  };
};

export const getPersonSchedule = async (personId: number, user: AuthUser): Promise<PersonScheduleResponse> => {
  const scheduleId = await getCurrentScheduleId();

  const peopleSchedule = await prisma.peopleSchedule.findFirst({
    where: {
      personId: personId,
      scheduleId: scheduleId
    },
    include: {
      person: {
        include: {
          assignments: {
            where: { scheduleId },
            include: {
              shift: {
                include: {
                  area: true,
                  day: true
                }
              }
            }
          },
          offDays: {
            where: { scheduleId },
            include: {
              day: true
            }
          },
          personnelNotes: {
            where: { scheduleId },
            orderBy: { sortOrder: 'asc' }
          },
          operationsNotes: {
            where: { scheduleId },
            orderBy: { sortOrder: 'asc' }
          }
        }
      },
      residentCategory: true
    }
  });

  if (!peopleSchedule) {
    throw new Error('Person not found in current schedule');
  }

  // Check permissions - user can view their own schedule or if they have appropriate role
  const canView = user.roles.includes('operations') || 
    user.roles.includes('manager') || 
    (user.roles.includes('personnel') && user.id === personId);

  if (!canView) {
    throw new Error('Access denied');
  }

  const editable = user.roles.includes('operations');
  const bounds = await getScheduleBounds(scheduleId);

  // Calculate total hours by day
  const totalHours = calculateHoursByDay(peopleSchedule.person.assignments);

  // Transform assignments
  const assignments = peopleSchedule.person.assignments.map(assignment => ({
    id: assignment.id,
    shiftId: assignment.shiftId,
    personId: assignment.personId,
    name: assignment.name || undefined,
    star: assignment.star
  }));

  return {
    person: {
      id: peopleSchedule.person.id,
      first: peopleSchedule.person.first,
      last: peopleSchedule.person.last,
      name: peopleSchedule.person.displayName || `${peopleSchedule.person.first} ${peopleSchedule.person.last.charAt(0)}`,
      category: {
        id: peopleSchedule.residentCategory.id,
        name: peopleSchedule.residentCategory.name,
        color: peopleSchedule.residentCategory.color || '#gray'
      },
      assignments
    },
    bounds,
    editable,
    totalHours,
    notes: {
      operations: peopleSchedule.person.operationsNotes.map(note => ({
        id: note.id,
        content: note.content
      })),
      personnel: peopleSchedule.person.personnelNotes.map(note => ({
        id: note.id,
        content: note.content
      }))
    },
    offDays: peopleSchedule.person.offDays.map(offDay => offDay.dayId)
  };
};

export const getGapsSchedule = async (user: AuthUser): Promise<GapsScheduleResponse> => {
  if (!user.roles.includes('operations') && !user.roles.includes('manager')) {
    throw new Error('Access denied');
  }

  const scheduleId = await getCurrentScheduleId();
  const bounds = await getScheduleBounds(scheduleId);

  // Find shifts that have fewer assignments than numPeople
  const unassignedShifts = await prisma.shift.findMany({
    where: {
      scheduleId,
      assignments: {
        every: {
          OR: [
            { personId: 0 },
            { person: { peopleSchedules: { none: { scheduleId } } } }
          ]
        }
      }
    },
    include: {
      assignments: {
        include: {
          person: true
        }
      },
      area: true,
      day: true
    },
    orderBy: [
      { day: { dayOfWeek: 'asc' } },
      { start: 'asc' }
    ]
  });

  // Transform to match expected format
  const shiftsWithAssignments = unassignedShifts.map(shift => ({
    id: shift.id,
    areaId: shift.areaId,
    dayId: shift.dayId,
    start: shift.start,
    end: shift.end,
    numPeople: shift.numPeople,
    assignments: shift.assignments.map(assignment => ({
      id: assignment.id,
      shiftId: assignment.shiftId,
      personId: assignment.personId,
      name: assignment.name || undefined,
      star: assignment.star,
      person: assignment.person ? {
        id: assignment.person.id,
        first: assignment.person.first,
        last: assignment.person.last,
        name: assignment.person.displayName || `${assignment.person.first} ${assignment.person.last.charAt(0)}`,
        category: {
          id: 0,
          name: '',
          color: ''
        }
      } : undefined
    }))
  }));

  return {
    unassignedShifts: shiftsWithAssignments,
    bounds
  };
};

function calculateHoursByDay(assignments: any[]): HoursByDay {
  const hoursByDay: HoursByDay = {};

  assignments.forEach(assignment => {
    const shift = assignment.shift;
    const dayId = shift.dayId;
    
    const startTime = new Date(`1970-01-01T${shift.start}`);
    const endTime = new Date(`1970-01-01T${shift.end}`);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    
    hoursByDay[dayId] = (hoursByDay[dayId] || 0) + hours;
  });

  return hoursByDay;
}