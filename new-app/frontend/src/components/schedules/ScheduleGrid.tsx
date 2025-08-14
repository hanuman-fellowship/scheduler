import React from 'react';
import './LegacySchedule.css';
import '../../types/legacy-html.d.ts';
import { secondsToDisplayTime } from '@shared/types';
import type { ScheduleBounds, AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse, ShiftWithAssignments } from '@shared/types';

interface ScheduleGridProps {
  bounds: ScheduleBounds;
  data: AreaScheduleResponse | PersonScheduleResponse | GapsScheduleResponse;
  editable: boolean;
  type: 'area' | 'person' | 'gaps';
  isRequestMode?: boolean;
  onShiftClick?: (shiftId: number) => void;
  onAddShift?: (dayId: number, slot: string) => void;
  onAddFloatingShift?: () => void;
  onNotesClick?: () => void;
  onAcceptShifts?: () => void;
}

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
  bounds,
  data,
  editable,
  type,
  isRequestMode = false,
  onShiftClick,
  onAddShift,
  onAddFloatingShift,
  onNotesClick,
  onAcceptShifts
}) => {
  // Get current date information for today highlighting
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Get date string in M/D format  
  const getDateString = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Convert day names to day numbers for today detection
  const getDayOfWeek = (dayName: string): number => {
    const dayMap: { [key: string]: number } = {
      'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
      'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };
    return dayMap[dayName] ?? -1;
  };

  const isToday = (dayName: string): boolean => {
    return getDayOfWeek(dayName) === currentDayOfWeek;
  };

  const getShiftsForCell = (dayId: number, timePeriodName: string) => {
    // Find the time period to get its boundaries
    const timePeriod = bounds.timePeriods.find(p => p.name === timePeriodName);
    if (!timePeriod) return [];

    switch (type) {
      case 'area':
        const areaData = data as AreaScheduleResponse;
        return (areaData.area.shifts as ShiftWithAssignments[]).filter(shift => 
          shift.dayId === dayId &&
          shift.startAtSeconds < timePeriod.endSeconds &&
          shift.endAtSeconds > timePeriod.startSeconds
        );

      case 'person':
        const personData = data as PersonScheduleResponse;
        return personData.person.assignments
          .filter(assignment => {
            const shift = assignment.shift;
            return shift.dayId === dayId &&
              shift.startAtSeconds < timePeriod.endSeconds &&
              shift.endAtSeconds > timePeriod.startSeconds;
          })
          .map(assignment => ({
            id: assignment.shift.id,
            areaId: assignment.shift.areaId,
            dayId: assignment.shift.dayId,
            startAtSeconds: assignment.shift.startAtSeconds,
            endAtSeconds: assignment.shift.endAtSeconds,
            numPeople: assignment.shift.numPeople,
            assignments: [{
              id: assignment.id,
              shiftId: assignment.shiftId,
              personId: assignment.personId,
              name: assignment.name,
              star: assignment.star,
              area: assignment.shift.area
            }]
          }));

      case 'gaps':
        const gapsData = data as GapsScheduleResponse;
        return gapsData.unassignedShifts.filter(shift => 
          shift.dayId === dayId &&
          shift.startAtSeconds < timePeriod.endSeconds &&
          shift.endAtSeconds > timePeriod.startSeconds
        );

      default:
        return [];
    }
  };

  // Render shift content exactly like the legacy system
  const renderShift = (shift: any, index: number) => {
    const startTime = secondsToDisplayTime(shift.startAtSeconds).replace(/\s?(AM|PM)/, '');
    const endTime = secondsToDisplayTime(shift.endAtSeconds).replace(/\s?(AM|PM)/, '');
    const timeRange = `${startTime} - ${endTime}`;

    return (
      <span key={shift.id} className="shift" id={shift.id.toString()}>
        <b 
          onClick={() => onShiftClick && onShiftClick(shift.id)}
          style={{ cursor: editable ? 'pointer' : 'default' }}
        >
          {timeRange}
        </b>
        <br />
        {shift.assignments?.map((assignment: any, assignmentIndex: number) => (
          <span key={assignment.id} style={{ position: 'relative' }} className="assignment">
            <span className="star" style={{ display: assignment.star ? '' : 'none' }}>*</span>
            {assignment.personId ? (
              <a 
                href={`#`} // TODO: Link to person schedule
                style={{ color: '#990099' }}
                title={`View ${assignment.name}'s Schedule`}
                onClick={(e) => e.preventDefault()}
              >
                {assignment.name}
              </a>
            ) : (
              <span 
                style={{ color: '#000', fontStyle: 'italic' }}
                title={`View ${assignment.name}'s Schedule`}
              >
                {assignment.name}
              </span>
            )}
            <br />
          </span>
        ))}
      </span>
    );
  };

  // Render a shift cell with exact legacy styling
  const renderShiftCell = (dayId: number, timePeriodName: string) => {
    const shifts = getShiftsForCell(dayId, timePeriodName);
    
    return (
      <td key={`${timePeriodName}-${dayId}`} borderColor="#000000">
        <div align="center" className="shift">
          <p>
            {shifts.map((shift, index) => renderShift(shift, index))}
          </p>
        </div>
      </td>
    );
  };

  // Calculate total hours for display
  const calculateTotalHours = (): number => {
    switch (type) {
      case 'area':
        const areaData = data as AreaScheduleResponse;
        return (areaData.area.shifts as ShiftWithAssignments[]).reduce((total, shift) => {
          const shiftHours = (shift.endAtSeconds - shift.startAtSeconds) / 3600;
          return total + (shiftHours * shift.numPeople);
        }, 0);
      
      case 'person':
        const personData = data as PersonScheduleResponse;
        return personData.person.assignments.reduce((total, assignment) => {
          const shiftHours = (assignment.shift.endAtSeconds - assignment.shift.startAtSeconds) / 3600;
          return total + shiftHours;
        }, 0);
      
      default:
        return 0;
    }
  };

  // Safety check for required data
  if (!bounds || !bounds.timePeriods || !bounds.days) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '128px' }}>
        <div style={{ fontSize: '18px', color: '#999' }}>
          No schedule data available
        </div>
      </div>
    );
  }

  return (
    <table 
      className="legacy-schedule-table"
      width="774" 
      border={2} 
      align="center" 
      cellPadding="0" 
      cellSpacing="0"
    >
      {/* Header Row with Days */}
      <tr>
        <td width="75" borderColor="#000000">
          <div align="center" className="no_print">
            {/* Empty corner cell */}
          </div>
        </td>
        {Object.entries(bounds.days).map(([dayId, dayName]) => {
          const isCurrentDay = isToday(dayName);
          return (
            <td 
              key={dayId}
              width="75" 
              borderColor="#000000"
            >
              <div align="center">
                <p>
                  {dayName}
                  {isCurrentDay && (
                    <>
                      <br />
                      {getDateString(today)}
                    </>
                  )}
                </p>
              </div>
            </td>
          );
        })}
      </tr>
      
      {/* Time Period Rows */}
      {bounds.timePeriods.map((timePeriod) => (
        <tr key={timePeriod.name}>
          <td width="75" height="60" borderColor="#000000">
            <div align="center">
              <p>{timePeriod.name}</p>
            </div>
          </td>
          {Object.entries(bounds.days).map(([dayId]) => 
            renderShiftCell(parseInt(dayId), timePeriod.name)
          )}
        </tr>
      ))}
      
      {/* Floating Shifts Row */}
      <tr>
        <td 
          id="0_0"
          onMouseEnter={(e) => {
            const addBtn = e.currentTarget.querySelector('a.add');
            if (addBtn) (addBtn as HTMLElement).style.display = 'inline-block';
          }}
          onMouseLeave={(e) => {
            const addBtn = e.currentTarget.querySelector('a.add');
            if (addBtn) (addBtn as HTMLElement).style.display = 'none';
          }}
          align="center" 
          height="13" 
          colSpan={8} 
          borderColor="#000000"
          style={{ padding: '3px' }}
        >
          {editable && onAddFloatingShift && (
            <a 
              className="add"
              id="add_0_0"
              onClick={onAddFloatingShift}
              style={{ display: 'none' }}
            >
              {" + "}
            </a>
          )}
          {/* Display floating shifts using legacy format */}
          Also {/* TODO: Add actual floating shifts data */}
          <br />
        </td>
      </tr>
      
      {/* Total Hours Row */}
      <tr>
        <td 
          align="left" 
          height="13" 
          colSpan={8} 
          borderColor="#000000"
          style={{ padding: '3px' }}
        >
          <a id="total_hours" title="Display hour breakdown (ctrl+h)">
            Total Hours: {Math.round(calculateTotalHours())} of {Math.round(calculateTotalHours())}
          </a>
        </td>
      </tr>
    </table>
  );
};