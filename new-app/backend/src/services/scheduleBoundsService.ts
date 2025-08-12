import prisma from './prisma';
import type { ScheduleBounds, TimeSlot, TimeRange } from '@shared/types';

export const getScheduleBounds = async (scheduleId: number): Promise<ScheduleBounds> => {
  const schedule = await prisma.schedule.findUnique({
    where: { id: scheduleId },
    include: {
      days: {
        orderBy: { dayOfWeek: 'asc' }
      },
      shifts: {
        include: {
          area: true,
          day: true
        }
      }
    }
  });

  if (!schedule) {
    throw new Error('Schedule not found');
  }

  const days: { [key: number]: string } = {};
  schedule.days.forEach(day => {
    days[day.id] = day.name;
  });

  const slots = calculateTimeSlots(schedule.shifts);
  const bounds = calculateBounds(schedule.shifts, slots, schedule.days);

  return {
    days,
    slots,
    bounds
  };
};

function calculateTimeSlots(shifts: any[]): TimeSlot[] {
  // If no shifts, provide default time slots for basic schedule viewing
  if (shifts.length === 0) {
    const defaultTimes = [
      '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '17:00'
    ];
    
    const slots: TimeSlot[] = [];
    for (let i = 0; i < defaultTimes.length - 1; i++) {
      const start = defaultTimes[i];
      const end = defaultTimes[i + 1];
      slots.push({
        id: `${start}-${end}`,
        name: `${formatTime(start)} - ${formatTime(end)}`,
        startTime: start,
        endTime: end
      });
    }
    return slots;
  }

  const timeSet = new Set<string>();
  
  shifts.forEach(shift => {
    timeSet.add(shift.start);
    timeSet.add(shift.end);
  });

  const sortedTimes = Array.from(timeSet).sort();
  const slots: TimeSlot[] = [];

  for (let i = 0; i < sortedTimes.length - 1; i++) {
    const start = sortedTimes[i];
    const end = sortedTimes[i + 1];
    
    if (hasShiftInTimeRange(shifts, start, end)) {
      slots.push({
        id: `${start}-${end}`,
        name: `${formatTime(start)} - ${formatTime(end)}`,
        startTime: start,
        endTime: end
      });
    }
  }

  return slots;
}

function hasShiftInTimeRange(shifts: any[], start: string, end: string): boolean {
  return shifts.some(shift => {
    return shift.start <= start && shift.end >= end;
  });
}

function calculateBounds(shifts: any[], slots: TimeSlot[], days: any[]): { [slot: string]: { [day: string]: TimeRange } } {
  const bounds: { [slot: string]: { [day: string]: TimeRange } } = {};

  slots.forEach(slot => {
    bounds[slot.id] = {};
    
    days.forEach(day => {
      const dayShifts = shifts.filter(shift => 
        shift.dayId === day.id &&
        shift.start <= slot.startTime &&
        shift.end >= slot.endTime
      );

      if (dayShifts.length > 0) {
        const earliest = dayShifts.reduce((min, shift) => 
          shift.start < min.start ? shift : min
        );
        const latest = dayShifts.reduce((max, shift) => 
          shift.end > max.end ? shift : max
        );

        bounds[slot.id][day.id.toString()] = {
          start: earliest.start,
          end: latest.end
        };
      }
    });
  });

  return bounds;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const minute = parseInt(minutes, 10);
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

export const getCurrentScheduleId = async (): Promise<number> => {
  const currentSchedule = await prisma.schedule.findFirst({
    where: { name: 'Published' },
    orderBy: { id: 'asc' }
  });

  if (!currentSchedule) {
    throw new Error('No published schedule found');
  }

  return currentSchedule.id;
};