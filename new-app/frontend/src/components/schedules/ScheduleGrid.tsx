import React from 'react';
import { ShiftCell } from './ShiftCell';
import type { ScheduleBounds, AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse } from '@shared/types';

interface ScheduleGridProps {
  bounds: ScheduleBounds;
  data: AreaScheduleResponse | PersonScheduleResponse | GapsScheduleResponse;
  editable: boolean;
  type: 'area' | 'person' | 'gaps';
  onShiftClick?: (shiftId: number) => void;
  onAddShift?: (dayId: number, slot: string) => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  bounds,
  data,
  editable,
  type,
  onShiftClick,
  onAddShift
}) => {
  // Get today's date for highlighting
  const today = new Date();
  const todayDay = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Convert day IDs to day numbers for comparison
  const getDayOfWeek = (dayId: number): number => {
    // Find the day in bounds.days and get its dayOfWeek
    const dayEntries = Object.entries(bounds.days);
    const dayEntry = dayEntries.find(([id]) => parseInt(id) === dayId);
    if (!dayEntry) return -1;
    
    // Map day names to numbers (Sunday = 0, Monday = 1, etc.)
    const dayName = dayEntry[1];
    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    return dayMap[dayName] ?? -1;
  };

  const isToday = (dayId: number): boolean => {
    return getDayOfWeek(dayId) === todayDay;
  };

  const getShiftsForCell = (dayId: number, slotId: string) => {
    switch (type) {
      case 'area':
        const areaData = data as AreaScheduleResponse;
        return areaData.area.shifts.filter(shift => 
          shift.dayId === dayId &&
          shift.start <= bounds.slots.find(s => s.id === slotId)?.startTime! &&
          shift.end >= bounds.slots.find(s => s.id === slotId)?.endTime!
        );

      case 'person':
        const personData = data as PersonScheduleResponse;
        // For person schedules, we need to get shifts from assignments
        return personData.person.assignments
          .map(assignment => {
            // We need to find the shift details for each assignment
            // This would normally come from the API, but for now we'll return empty
            // TODO: Include shift details in person schedule API response
            return null;
          })
          .filter(Boolean);

      case 'gaps':
        const gapsData = data as GapsScheduleResponse;
        return gapsData.unassignedShifts.filter(shift => 
          shift.dayId === dayId &&
          shift.start <= bounds.slots.find(s => s.id === slotId)?.startTime! &&
          shift.end >= bounds.slots.find(s => s.id === slotId)?.endTime!
        );

      default:
        return [];
    }
  };

  return (
    <div className="overflow-x-auto">
      <table 
        className="border-2 border-black"
        style={{ width: '774px', minWidth: '774px' }}
      >
        <thead>
          <tr>
            <th className="border-2 border-black bg-gray-100 p-2 font-bold text-center w-20">
              Time
            </th>
            {Object.entries(bounds.days).map(([dayId, dayName]) => (
              <th 
                key={dayId}
                className={`border-2 border-black p-2 font-bold text-center ${
                  isToday(parseInt(dayId)) ? 'bg-yellow-100' : 'bg-gray-100'
                }`}
                style={{ width: '75px' }}
              >
                {dayName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bounds.slots.map(slot => (
            <tr key={slot.id}>
              <td className="border-2 border-black bg-gray-50 p-2 text-center text-sm font-medium">
                {slot.name}
              </td>
              {Object.entries(bounds.days).map(([dayId, dayName]) => {
                const shifts = getShiftsForCell(parseInt(dayId), slot.id);
                return (
                  <ShiftCell
                    key={`${slot.id}-${dayId}`}
                    shifts={shifts}
                    dayId={parseInt(dayId)}
                    timeSlot={slot}
                    type={type}
                    editable={editable}
                    isToday={isToday(parseInt(dayId))}
                    onShiftClick={onShiftClick}
                    onAdd={onAddShift ? () => onAddShift(parseInt(dayId), slot.id) : undefined}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};