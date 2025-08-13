import React from 'react';
import type { ScheduleBounds, HoursByDay } from '@shared/types';

interface HoursSummaryRowProps {
  totalHours: HoursByDay;
  bounds: ScheduleBounds;
  todayDayId?: number;
}

export const HoursSummaryRow: React.FC<HoursSummaryRowProps> = ({
  totalHours,
  bounds,
  todayDayId
}) => {
  // Calculate total hours across all days
  const overallHours = Object.values(totalHours).reduce((sum, hours) => sum + hours, 0);

  return (
    <tr className="hours-summary-row">
      <td className="hours-label">Hours</td>
      {Object.keys(bounds.days).map(dayIdStr => {
        const dayId = parseInt(dayIdStr);
        const hours = totalHours[dayId] || 0;
        const isToday = dayId === todayDayId;

        return (
          <td 
            key={dayId} 
            className={`hours-cell ${isToday ? 'today' : ''}`}
          >
            {hours > 0 ? hours.toFixed(1) : ''}
          </td>
        );
      })}
      <td className="hours-total">
        Total: {overallHours.toFixed(1)}
      </td>
    </tr>
  );
};