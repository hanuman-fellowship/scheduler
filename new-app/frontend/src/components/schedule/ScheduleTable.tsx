import React from 'react';
import type { 
  ScheduleBounds, 
  AreaScheduleResponse, 
  PersonScheduleResponse, 
  GapsScheduleResponse 
} from '@shared/types';
import { TimeSlotRow } from './TimeSlotRow';
import { HoursSummaryRow } from './HoursSummaryRow';
import { FloatingShiftsRow } from './FloatingShiftsRow';
import './ScheduleTable.css';

interface ScheduleTableProps {
  bounds: ScheduleBounds;
  data: AreaScheduleResponse | PersonScheduleResponse | GapsScheduleResponse;
  type: 'area' | 'person' | 'gaps';
  editable: boolean;
  mode?: 'view' | 'edit' | 'request' | 'print';
  onAddShift?: (dayId: number, periodName: string) => void;
  onShiftClick?: (shiftId: number) => void;
  onAddFloatingShift?: () => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  bounds,
  data,
  type,
  editable,
  mode = 'view',
  onAddShift,
  onShiftClick,
  onAddFloatingShift
}) => {
  // Get today's day of week (1 = Sunday)
  const today = new Date().getDay() || 7; // Convert 0 (Sunday) to 7
  
  // Find today's day ID from bounds
  const todayDayId = Object.keys(bounds.days).find(dayId => {
    const dayName = bounds.days[parseInt(dayId)];
    const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
    return dayIndex === (today === 7 ? 0 : today);
  });

  // Get shifts based on type
  const getShifts = () => {
    if (type === 'area' && 'area' in data) {
      return data.area.shifts;
    } else if (type === 'person' && 'person' in data) {
      // Transform assignments to shifts for display
      return data.person.assignments.map(assignment => ({
        ...assignment.shift,
        assignments: [assignment]
      }));
    } else if (type === 'gaps' && 'unassignedShifts' in data) {
      return data.unassignedShifts;
    }
    return [];
  };

  const shifts = getShifts();
  const isRequestMode = mode === 'request';

  return (
    <div className="schedule-table-container">
      <table 
        className={`schedule-table ${isRequestMode ? 'request-mode' : ''}`}
        cellPadding={0}
        cellSpacing={0}
      >
        <thead>
          <tr className="day-header-row">
            <th className="time-slot-header"></th>
            {Object.entries(bounds.days).map(([dayId, dayName]) => (
              <th 
                key={dayId} 
                className={`day-header ${dayId === todayDayId ? 'today' : ''}`}
              >
                {dayName}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render 3 time period rows */}
          {bounds.timePeriods.map(period => (
            <TimeSlotRow
              key={period.name}
              period={period}
              bounds={bounds}
              shifts={shifts}
              type={type}
              editable={editable && mode === 'edit'}
              todayDayId={todayDayId ? parseInt(todayDayId) : undefined}
              onShiftClick={onShiftClick}
              onAddShift={onAddShift}
            />
          ))}

          {/* Hours summary row for person schedules */}
          {type === 'person' && 'person' in data && (
            <HoursSummaryRow
              totalHours={data.totalHours}
              bounds={bounds}
              todayDayId={todayDayId ? parseInt(todayDayId) : undefined}
            />
          )}

          {/* Floating shifts row for area schedules */}
          {type === 'area' && 'area' in data && (
            <FloatingShiftsRow
              floatingShifts={data.area.floatingShifts || []}
              editable={editable && mode === 'edit'}
              onAdd={onAddFloatingShift}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};