import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TotalHoursRow } from '../TotalHoursRow';
import type { ShiftWithAssignments, FloatingShiftResponse } from '@shared/types';

describe('TotalHoursRow', () => {
  const mockShifts: ShiftWithAssignments[] = [
    {
      id: 1,
      areaId: 1,
      dayId: 1,
      startAtSeconds: 28800, // 8:00 AM
      endAtSeconds: 57600, // 4:00 PM (8 hours)
      numPeople: 2,
      assignments: [
        { id: 1, shiftId: 1, personId: 1, star: false },
        { id: 2, shiftId: 1, personId: 2, star: false }
      ]
    },
    {
      id: 2,
      areaId: 1,
      dayId: 2,
      startAtSeconds: 32400, // 9:00 AM
      endAtSeconds: 46800, // 1:00 PM (4 hours)
      numPeople: 1,
      assignments: [
        { id: 3, shiftId: 2, personId: 1, star: true }
      ]
    }
  ];

  const mockFloatingShifts: FloatingShiftResponse[] = [
    {
      id: 1,
      areaId: 1,
      personId: 1,
      hours: 2.5,
      person: {
        id: 1,
        name: 'John Doe',
        first: 'John',
        last: 'Doe'
      }
    }
  ];

  it('should calculate and display total assigned vs available hours', () => {
    render(
      <table>
        <tbody>
          <TotalHoursRow 
            shifts={mockShifts}
            floatingShifts={mockFloatingShifts}
          />
        </tbody>
      </table>
    );

    // Shift 1: 2 assignments × 8 hours = 16 assigned hours (capacity: 2 × 8 = 16)
    // Shift 2: 1 assignment × 4 hours = 4 assigned hours (capacity: 1 × 4 = 4)  
    // Floating: 2.5 hours
    // Total assigned: 16 + 4 + 2.5 = 22.5
    // Total available: 16 + 4 + 2.5 = 22.5
    expect(screen.getByText('Total Hours: 22.5 of 22.5')).toBeInTheDocument();
  });

  it('should show difference when not all shifts are fully assigned', () => {
    const underAssignedShifts: ShiftWithAssignments[] = [
      {
        id: 1,
        areaId: 1,
        dayId: 1,
        startAtSeconds: 28800, // 8:00 AM
        endAtSeconds: 57600, // 4:00 PM (8 hours)
        numPeople: 3, // Capacity for 3 people
        assignments: [
          { id: 1, shiftId: 1, personId: 1, star: false }
        ] // Only 1 person assigned
      }
    ];

    render(
      <table>
        <tbody>
          <TotalHoursRow 
            shifts={underAssignedShifts}
            floatingShifts={[]}
          />
        </tbody>
      </table>
    );

    // 1 assignment × 8 hours = 8 assigned
    // 3 capacity × 8 hours = 24 available
    expect(screen.getByText('Total Hours: 8.0 of 24.0')).toBeInTheDocument();
  });

  it('should handle empty shifts and floating shifts', () => {
    render(
      <table>
        <tbody>
          <TotalHoursRow 
            shifts={[]}
            floatingShifts={[]}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Total Hours: 0.0 of 0.0')).toBeInTheDocument();
  });

  it('should handle only floating shifts', () => {
    render(
      <table>
        <tbody>
          <TotalHoursRow 
            shifts={[]}
            floatingShifts={mockFloatingShifts}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText('Total Hours: 2.5 of 2.5')).toBeInTheDocument();
  });

  it('should span the full table width', () => {
    render(
      <table>
        <tbody>
          <TotalHoursRow 
            shifts={mockShifts}
            floatingShifts={mockFloatingShifts}
          />
        </tbody>
      </table>
    );

    const cell = screen.getByText('Total Hours: 22.5 of 22.5').closest('td');
    expect(cell).toHaveAttribute('colSpan', '8');
  });
});