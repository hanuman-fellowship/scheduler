import React from 'react';
import type { ShiftWithAssignments, FloatingShiftResponse } from '@shared/types';

interface TotalHoursRowProps {
  shifts: ShiftWithAssignments[];
  floatingShifts: FloatingShiftResponse[];
}

export const TotalHoursRow: React.FC<TotalHoursRowProps> = ({
  shifts,
  floatingShifts
}) => {
  // Calculate total assigned hours from shifts
  const calculateAssignedHours = () => {
    const shiftHours = shifts.reduce((total, shift) => {
      const durationSeconds = shift.endAtSeconds - shift.startAtSeconds;
      const hours = durationSeconds / 3600; // Convert seconds to hours
      // Count actual assignments, not numPeople (which is capacity)
      const assignedCount = shift.assignments?.length || 0;
      return total + (hours * assignedCount);
    }, 0);
    
    // Add floating shift hours
    const floatingHours = floatingShifts.reduce((total, fs) => total + fs.hours, 0);
    
    return shiftHours + floatingHours;
  };

  // Calculate total available hours (shift capacity)
  const calculateTotalHours = () => {
    const totalShiftHours = shifts.reduce((total, shift) => {
      const durationSeconds = shift.endAtSeconds - shift.startAtSeconds;
      const hours = durationSeconds / 3600;
      return total + (hours * shift.numPeople); // Full capacity
    }, 0);
    
    // Add floating shift hours
    const floatingHours = floatingShifts.reduce((total, fs) => total + fs.hours, 0);
    
    return totalShiftHours + floatingHours;
  };

  const assignedHours = calculateAssignedHours();
  const totalHours = calculateTotalHours();

  return (
    <tr className="total-hours-row">
      <td colSpan={8} className="total-hours-cell">
        <div className="total-hours-container">
          Total Hours: {assignedHours.toFixed(1)} of {totalHours.toFixed(1)}
        </div>
      </td>
    </tr>
  );
};