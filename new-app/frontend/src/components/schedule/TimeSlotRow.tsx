import React from 'react';
import type { TimePeriod, ScheduleBounds, ShiftWithAssignments } from '@shared/types';
import { ShiftCell } from './ShiftCell';

interface TimeSlotRowProps {
  period: TimePeriod;
  bounds: ScheduleBounds;
  shifts: ShiftWithAssignments[];
  type: 'area' | 'person' | 'gaps';
  editable: boolean;
  todayDayId?: number;
  onShiftClick?: (shiftId: number) => void;
  onAssignmentClick?: (shiftId: number, shiftName: string) => void;
  onAddShift?: (dayId: number, periodName: string) => void;
}

export const TimeSlotRow: React.FC<TimeSlotRowProps> = ({
  period,
  bounds,
  shifts,
  type,
  editable,
  todayDayId,
  onShiftClick,
  onAssignmentClick,
  onAddShift
}) => {
  // Filter shifts for this time period based on start time
  const getShiftsForPeriod = (dayId: number): ShiftWithAssignments[] => {
    return shifts.filter(shift => 
      shift.dayId === dayId &&
      shift.startAtSeconds >= period.startSeconds &&
      shift.startAtSeconds < period.endSeconds
    );
  };

  return (
    <tr className="time-slot-row">
      <td className="time-slot-label">{period.name}</td>
      {Object.keys(bounds.days).map(dayIdStr => {
        const dayId = parseInt(dayIdStr);
        const dayShifts = getShiftsForPeriod(dayId);
        const isToday = dayId === todayDayId;

        return (
          <ShiftCell
            key={dayId}
            shifts={dayShifts}
            dayId={dayId}
            periodName={period.name}
            type={type}
            editable={editable}
            isToday={isToday}
            onShiftClick={onShiftClick}
            onAssignmentClick={onAssignmentClick}
            onAdd={() => onAddShift?.(dayId, period.name)}
          />
        );
      })}
    </tr>
  );
};