import React from 'react';
import type { ShiftWithAssignments } from '@shared/types';
import { ShiftBlock } from './ShiftBlock';

interface ShiftCellProps {
  shifts: ShiftWithAssignments[];
  dayId: number;
  periodName: string;
  type: 'area' | 'person' | 'gaps';
  editable: boolean;
  isToday: boolean;
  onShiftClick?: (shiftId: number) => void;
  onAdd?: () => void;
}

export const ShiftCell: React.FC<ShiftCellProps> = ({
  shifts,
  dayId,
  periodName,
  type,
  editable,
  isToday,
  onShiftClick,
  onAdd
}) => {
  return (
    <td 
      className={`shift-cell ${isToday ? 'today' : ''} ${editable ? 'editable' : ''}`}
      data-testid={`${periodName.toLowerCase()}-${dayId}`}
    >
      {/* Render shifts with legacy stacking */}
      {shifts.map((shift, index) => (
        <ShiftBlock
          key={shift.id}
          shift={shift}
          type={type}
          isFirst={index === 0}
          editable={editable}
          onShiftClick={onShiftClick}
        />
      ))}

      {/* Add button for editable mode */}
      {editable && (
        <button
          className="add-shift-button"
          onClick={onAdd}
          aria-label={`Add shift for ${periodName} on day ${dayId}`}
        >
          +
        </button>
      )}

      {/* Empty cells remain empty - no placeholder content */}
    </td>
  );
};