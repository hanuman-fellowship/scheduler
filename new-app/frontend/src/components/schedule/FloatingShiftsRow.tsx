import React from 'react';
import type { FloatingShiftResponse } from '@shared/types';

interface FloatingShiftsRowProps {
  floatingShifts: FloatingShiftResponse[];
  editable: boolean;
  onAdd?: () => void;
  onEdit?: (shiftId: number) => void;
  onDelete?: (shiftId: number) => void;
}

export const FloatingShiftsRow: React.FC<FloatingShiftsRowProps> = ({
  floatingShifts,
  editable,
  onAdd,
  onEdit,
  onDelete
}) => {
  return (
    <tr className="floating-shifts-row">
      <td colSpan={8} className="floating-shifts-cell">
        <div className="floating-shifts-container">
          <span className="floating-shifts-label">Floating Shifts: </span>
          {floatingShifts.map(shift => (
            <span 
              key={shift.id} 
              className="floating-shift"
              onClick={() => editable && onEdit?.(shift.id)}
              style={{ cursor: editable ? 'pointer' : 'default' }}
            >
              {shift.hours} hours
              {editable && (
                <button
                  className="delete-floating-shift"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(shift.id);
                  }}
                  aria-label="Delete floating shift"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {editable && (
            <button
              className="add-floating-shift"
              onClick={onAdd}
              aria-label="Add floating shift"
            >
              + Add Floating Shift
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};