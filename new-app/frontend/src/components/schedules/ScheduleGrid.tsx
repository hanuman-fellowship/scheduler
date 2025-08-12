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

  const getShiftsForCell = (dayId: number, timePeriodName: string) => {
    // Find the time period to get its boundaries
    const timePeriod = bounds.timePeriods.find(p => p.name === timePeriodName);
    if (!timePeriod) return [];

    switch (type) {
      case 'area':
        const areaData = data as AreaScheduleResponse;
        return areaData.area.shifts.filter(shift => 
          shift.dayId === dayId &&
          shift.startAtSeconds < timePeriod.endSeconds &&
          shift.endAtSeconds > timePeriod.startSeconds
        );

      case 'person':
        const personData = data as PersonScheduleResponse;
        // For person schedules, get shifts from assignments that match the cell
        return personData.person.assignments
          .filter(assignment => {
            const shift = assignment.shift;
            return shift.dayId === dayId &&
              shift.startAtSeconds < timePeriod.endSeconds &&
              shift.endAtSeconds > timePeriod.startSeconds;
          })
          .map(assignment => ({
            id: assignment.shift.id,
            areaId: assignment.shift.areaId,
            dayId: assignment.shift.dayId,
            startAtSeconds: assignment.shift.startAtSeconds,
            endAtSeconds: assignment.shift.endAtSeconds,
            numPeople: assignment.shift.numPeople,
            assignments: [{
              id: assignment.id,
              shiftId: assignment.shiftId,
              personId: assignment.personId,
              name: assignment.name,
              star: assignment.star,
              area: assignment.shift.area
            }]
          }));

      case 'gaps':
        const gapsData = data as GapsScheduleResponse;
        return gapsData.unassignedShifts.filter(shift => 
          shift.dayId === dayId &&
          shift.startAtSeconds < timePeriod.endSeconds &&
          shift.endAtSeconds > timePeriod.startSeconds
        );

      default:
        return [];
    }
  };

  // Safety check for required data
  if (!bounds || !bounds.timePeriods || !bounds.days) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-lg text-gray-500">
          No schedule data available
        </div>
      </div>
    );
  }

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
          {bounds.timePeriods.map(timePeriod => (
            <tr key={timePeriod.name}>
              <td className="border-2 border-black bg-gray-50 p-2 text-center text-sm font-medium">
                {timePeriod.name}
              </td>
              {Object.entries(bounds.days).map(([dayId, dayName]) => {
                const shifts = getShiftsForCell(parseInt(dayId), timePeriod.name);
                return (
                  <ShiftCell
                    key={`${timePeriod.name}-${dayId}`}
                    shifts={shifts}
                    dayId={parseInt(dayId)}
                    timeSlot={{ id: timePeriod.name, name: timePeriod.name }}
                    type={type}
                    editable={editable}
                    isToday={isToday(parseInt(dayId))}
                    onShiftClick={onShiftClick}
                    onAdd={onAddShift ? () => onAddShift(parseInt(dayId), timePeriod.name) : undefined}
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