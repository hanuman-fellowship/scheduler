import React, { useState } from 'react';
import type { ShiftWithAssignments, TimeSlot } from '@shared/types';
import { formatTimeRange } from '../../../../shared/src/timeUtils';
import './LegacySchedule.css';

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
  const [, setIsHovered] = useState(false);

  // Use the shared formatTimeRange function for minimal time display
  const formatShiftTime = (startSeconds: number, endSeconds: number) => {
    return formatTimeRange(startSeconds, endSeconds);
  };

  const renderShift = (shift: ShiftWithAssignments, index: number) => {
    const isFirstShift = index === 0;
    switch (type) {
      case 'area':
        return (
          <span 
            key={shift.id}
            id={`shift_${shift.id}`}
            className={`shift ${!isFirstShift ? 'stacked' : ''}`}
          >
            <b className="shift-time">
              <a 
                className={editable ? 'editable-link' : ''}
                onClick={editable ? () => onShiftClick?.(shift.id) : undefined}
              >
                {formatShiftTime(shift.startAtSeconds, shift.endAtSeconds)}
              </a>
            </b>
            <br />
            {shift.assignments.map(assignment => (
              <span key={assignment.id} className="assignment-name">
                {assignment.star && <span className="star">★</span>}
                {assignment.person ? (
                  <a className={editable ? 'editable-link' : ''}>
                    {assignment.person.name || assignment.name}
                  </a>
                ) : assignment.name ? (
                  <span>{assignment.name}</span>
                ) : null}
                <br />
              </span>
            ))}
            {/* Render unassigned slots */}
            {Array.from({ length: shift.numPeople - shift.assignments.length }).map((_, idx) => (
              <span key={`unassigned_${idx}`} className="assignment-name">
                <a className="assignment-unassigned">
                  ________
                </a>
                <br />
              </span>
            ))}
          </span>
        );

      case 'person':
        // For person schedules, show area and time
        const assignment = shift.assignments[0]; // Person schedules have one assignment per shift
        return (
          <span 
            key={shift.id}
            className="shift person"
          >
            <b className="shift-time">
              <a 
                className={editable ? 'editable-link' : ''}
                onClick={editable ? () => onShiftClick?.(shift.id) : undefined}
              >
                {formatShiftTime(shift.startAtSeconds, shift.endAtSeconds)}
              </a>
            </b>
            <br />
            <span className="assignment-name">
              {assignment?.star && <span className="star">★</span>}
              Area {(assignment as any)?.area?.name || shift.areaId}
            </span>
          </span>
        );

      case 'gaps':
        return (
          <span 
            key={shift.id}
            className={`shift ${!isFirstShift ? 'stacked' : ''}`}
            style={{ color: '#ff0000' }}
          >
            <b className="shift-time">
              <a 
                style={{ color: '#ff0000' }}
                onClick={() => onShiftClick?.(shift.id)}
              >
                {formatShiftTime(shift.startAtSeconds, shift.endAtSeconds)}
              </a>
            </b>
            <br />
            <span style={{ color: '#ff0000' }}>
              Need {shift.numPeople}
            </span>
          </span>
        );

      default:
        return null;
    }
  };

  // Determine if this is an off day for person schedules
  const isOffDay = type === 'person' && shifts.length === 0;
  
  return (
    <td 
      id={`${timeSlot.name}_${dayId}`}
      className={`schedule-cell-75 shift-cell-height shift-cell ${
        isToday ? 'today-highlight' : ''
      } ${isOffDay ? 'dayoff-bg' : ''} ${editable ? 'editable' : ''}`}
      style={{ borderColor: '#000000', position: 'relative' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ textAlign: 'center' }} className="shift">
        <p>
          {/* Add shift button - hidden by default, shown on hover */}
          {editable && onAdd && (
            <a 
              className="add"
              id={`add_${timeSlot.name}_${dayId}`}
              onClick={onAdd}
              style={{ 
                position: 'absolute',
                top: '2px',
                right: '2px'
              }}
            >
              {" + "}
            </a>
          )}
          
          {/* Off day X for print mode */}
          {isOffDay && <span className="dayoff_x">X</span>}
          
          {/* Render all shifts */}
          {shifts.map((shift, index) => renderShift(shift, index))}
          
          {/* Empty state for gaps view */}
          {type === 'gaps' && shifts.length === 0 && (
            <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
              No gaps
            </span>
          )}
        </p>
      </div>
    </td>
  );
};