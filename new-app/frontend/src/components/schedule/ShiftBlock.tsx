import React from 'react';
import type { ShiftWithAssignments } from '@shared/types';
import { formatTimeRange } from '../../../../shared/src/timeUtils';
import { AssignmentList } from './AssignmentList';

interface ShiftBlockProps {
  shift: ShiftWithAssignments;
  type: 'area' | 'person' | 'gaps';
  isFirst: boolean;
  editable: boolean;
  onShiftClick?: (shiftId: number) => void;
}

export const ShiftBlock: React.FC<ShiftBlockProps> = ({
  shift,
  type,
  isFirst,
  editable,
  onShiftClick
}) => {
  const timeRange = formatTimeRange(shift.startAtSeconds, shift.endAtSeconds);

  // Area schedule: show time range and assignments
  if (type === 'area' || type === 'gaps') {
    return (
      <span 
        className={`shift ${isFirst ? '' : 'stacked'}`}
        id={`shift-${shift.id}`}
        onClick={() => editable && onShiftClick?.(shift.id)}
        style={{ cursor: editable ? 'pointer' : 'default' }}
      >
        <b>{timeRange}</b>
        <br />
        <AssignmentList
          assignments={shift.assignments}
          numPeople={shift.numPeople}
          editable={editable}
        />
      </span>
    );
  }

  // Person schedule: show area short name and time
  if (type === 'person') {
    // Get area info from the first assignment's shift data
    const area = 'area' in shift ? shift.area : null;
    
    return (
      <span 
        className="person shift"
        onClick={() => editable && onShiftClick?.(shift.id)}
        style={{ cursor: editable ? 'pointer' : 'default' }}
      >
        {area && (
          <>
            <b>
              <a href="#" onClick={(e) => e.preventDefault()}>
                {area.shortName}
              </a>
            </b>{' '}
          </>
        )}
        {timeRange}
        <br />
      </span>
    );
  }

  return null;
};