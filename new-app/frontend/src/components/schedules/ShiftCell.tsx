import React, { useState } from 'react';
import type { ShiftWithAssignments, TimeSlot } from '@shared/types';

interface ShiftCellProps {
  shifts: ShiftWithAssignments[];
  dayId: number;
  timeSlot: TimeSlot;
  type: 'area' | 'person' | 'gaps';
  editable: boolean;
  isToday: boolean;
  onShiftClick?: (shiftId: number) => void;
  onAdd?: () => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shifts,
  dayId,
  timeSlot,
  type,
  editable,
  isToday,
  onShiftClick,
  onAdd
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTimeRange = (start: string, end: string) => {
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayMinute = minute === 0 ? '' : `:${minute.toString().padStart(2, '0')}`;
      return `${displayHour}${displayMinute}${period}`;
    };

    return `${formatTime(start)}-${formatTime(end)}`;
  };

  const renderShift = (shift: ShiftWithAssignments) => {
    switch (type) {
      case 'area':
        return (
          <div 
            key={shift.id}
            className="mb-1 p-1 text-xs cursor-pointer hover:bg-gray-100 border border-gray-300 rounded"
            onClick={() => onShiftClick?.(shift.id)}
          >
            <div className="font-semibold">
              {formatTimeRange(shift.start, shift.end)}
            </div>
            <div className="space-y-1">
              {shift.assignments.map(assignment => (
                <div 
                  key={assignment.id}
                  className="flex items-center justify-between"
                >
                  <span className={assignment.person ? 'text-blue-600' : 'text-gray-500'}>
                    {assignment.person?.name || assignment.name || 'Unassigned'}
                  </span>
                  {assignment.star && <span className="text-yellow-500">⭐</span>}
                </div>
              ))}
              {shift.assignments.length < shift.numPeople && (
                <div className="text-gray-400 italic">
                  Need {shift.numPeople - shift.assignments.length} more
                </div>
              )}
            </div>
          </div>
        );

      case 'person':
        // For person schedules, show area and time
        const assignment = shift.assignments[0]; // Person schedules have one assignment per shift
        return (
          <div 
            key={shift.id}
            className="mb-1 p-1 text-xs cursor-pointer hover:bg-gray-100 border border-gray-300 rounded"
            onClick={() => onShiftClick?.(shift.id)}
          >
            <div className="font-semibold text-blue-600">
              {assignment?.area?.shortName || `Area ${shift.areaId}`}
            </div>
            <div>{formatTimeRange(shift.start, shift.end)}</div>
            {assignment?.star && <span className="text-yellow-500">⭐</span>}
          </div>
        );

      case 'gaps':
        return (
          <div 
            key={shift.id}
            className="mb-1 p-1 text-xs cursor-pointer hover:bg-red-100 border border-red-300 rounded bg-red-50"
            onClick={() => onShiftClick?.(shift.id)}
          >
            <div className="font-semibold text-red-600">
              {formatTimeRange(shift.start, shift.end)}
            </div>
            <div className="text-red-500">
              Need {shift.numPeople} people
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <td 
      className={`border-2 border-black p-1 align-top relative ${
        isToday ? 'bg-yellow-50' : 'bg-white'
      }`}
      style={{ 
        width: '75px', 
        minHeight: '60px',
        maxHeight: '120px',
        overflow: 'hidden'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="space-y-1 h-full overflow-y-auto">
        {shifts.map(renderShift)}
        
        {/* Add button for editable mode */}
        {editable && isHovered && onAdd && (
          <button
            onClick={onAdd}
            className="w-full p-1 text-xs bg-blue-100 hover:bg-blue-200 border border-blue-300 rounded text-blue-600 font-medium"
            title="Add shift"
          >
            + Add
          </button>
        )}
        
        {/* Empty state for gaps view */}
        {type === 'gaps' && shifts.length === 0 && (
          <div className="text-xs text-gray-400 italic text-center py-2">
            No gaps
          </div>
        )}
      </div>
    </td>
  );
};