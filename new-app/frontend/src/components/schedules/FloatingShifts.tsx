import React from 'react';
import type { FloatingShiftResponse } from '@shared/types';

interface FloatingShiftsProps {
  shifts: FloatingShiftResponse[];
  editable: boolean;
  onAdd?: () => void;
  onEdit?: (shiftId: number) => void;
  onDelete?: (shiftId: number) => void;
}

export const FloatingShifts: React.FC<FloatingShiftsProps> = ({
  shifts,
  editable,
  onAdd,
  onEdit,
  onDelete
}) => {
  if (shifts.length === 0 && !editable) {
    return null;
  }

  return (
    <div className="bg-white border-2 border-black p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Floating Shifts</h3>
        {editable && onAdd && (
          <button
            onClick={onAdd}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            Add Floating Shift
          </button>
        )}
      </div>

      {shifts.length === 0 ? (
        <div className="text-gray-500 italic text-center py-4">
          No floating shifts
        </div>
      ) : (
        <div className="space-y-2">
          {shifts.map(shift => (
            <div 
              key={shift.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded"
            >
              <div className="flex-1">
                <div className="font-medium">
                  Person ID: {shift.personId} {/* TODO: Get person name */}
                </div>
                <div className="text-sm text-gray-600">
                  {shift.hours} hours
                </div>
              </div>

              {editable && (
                <div className="flex space-x-2">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(shift.id)}
                      className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 text-xs rounded"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(shift.id)}
                      className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};