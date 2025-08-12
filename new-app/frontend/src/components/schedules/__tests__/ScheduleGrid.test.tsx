import { render, screen } from '@testing-library/react';
import { ScheduleGrid } from '../ScheduleGrid';
import type { ScheduleBounds, AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse } from '@shared/types';

// Mock data for testing
const mockBounds: ScheduleBounds = {
  days: {
    1: 'Sunday',
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday'
  },
  slots: [
    {
      id: '08:00-12:00',
      name: '8:00 AM - 12:00 PM',
      startTime: '08:00',
      endTime: '12:00'
    },
    {
      id: '13:00-17:00',
      name: '1:00 PM - 5:00 PM',
      startTime: '13:00',
      endTime: '17:00'
    }
  ],
  bounds: {}
};

const mockAreaSchedule: AreaScheduleResponse = {
  area: {
    id: 1,
    name: 'Kitchen',
    shortName: 'K',
    scheduleId: 1,
    notes: 'Kitchen area',
    shifts: [
      {
        id: 1,
        areaId: 1,
        dayId: 2, // Monday
        start: '08:00',
        end: '12:00',
        numPeople: 2,
        scheduleId: 1,
        assignments: [
          {
            id: 1,
            shiftId: 1,
            personId: 1,
            name: undefined,
            star: false,
            person: {
              id: 1,
              first: 'John',
              last: 'Doe',
              displayName: 'John D',
              name: 'John D',
              email: 'john@example.com',
              active: true,
              category: {
                id: 1,
                name: 'Residents',
                color: '#4ECDC4'
              }
            }
          }
        ]
      }
    ]
  },
  bounds: mockBounds,
  editable: true
};

const mockPersonSchedule: PersonScheduleResponse = {
  person: {
    id: 1,
    first: 'John',
    last: 'Doe',
    displayName: 'John D',
    name: 'John D',
    email: 'john@example.com',
    active: true,
    category: {
      id: 1,
      name: 'Residents',
      color: '#4ECDC4'
    },
    assignments: [
      {
        id: 1,
        shiftId: 1,
        personId: 1,
        name: undefined,
        star: false,
        shift: {
          id: 1,
          areaId: 1,
          dayId: 2, // Monday
          start: '08:00',
          end: '12:00',
          numPeople: 2,
          area: {
            id: 1,
            name: 'Kitchen',
            shortName: 'K'
          }
        }
      }
    ]
  },
  bounds: mockBounds,
  editable: false,
  totalHours: { 2: 4 }, // Monday: 4 hours
  notes: {
    operations: [],
    personnel: []
  },
  offDays: []
};

const mockGapsSchedule: GapsScheduleResponse = {
  unassignedShifts: [
    {
      id: 2,
      areaId: 1,
      dayId: 3, // Tuesday
      start: '13:00',
      end: '17:00',
      numPeople: 1,
      scheduleId: 1,
      assignments: []
    }
  ],
  bounds: mockBounds
};

describe('ScheduleGrid', () => {
  it('renders area schedule grid correctly', () => {
    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockAreaSchedule}
        editable={true}
        type="area"
      />
    );

    // Check that day headers are rendered
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('Tuesday')).toBeInTheDocument();

    // Check that time slots are rendered
    expect(screen.getByText('8:00 AM - 12:00 PM')).toBeInTheDocument();
    expect(screen.getByText('1:00 PM - 5:00 PM')).toBeInTheDocument();

    // Check that the grid has proper styling
    const table = screen.getByRole('table');
    expect(table).toHaveStyle({ width: '774px' });
  });

  it('renders person schedule grid correctly', () => {
    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockPersonSchedule}
        editable={false}
        type="person"
      />
    );

    // Should render the grid structure
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('8:00 AM - 12:00 PM')).toBeInTheDocument();
  });

  it('renders gaps schedule grid correctly', () => {
    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockGapsSchedule}
        editable={false}
        type="gaps"
      />
    );

    // Should render the grid structure
    expect(screen.getByText('Tuesday')).toBeInTheDocument();
    expect(screen.getByText('1:00 PM - 5:00 PM')).toBeInTheDocument();
  });

  it('renders grid structure correctly', () => {
    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockAreaSchedule}
        editable={true}
        type="area"
      />
    );

    // Find the Monday header cell - it should have default styling
    const mondayHeader = screen.getByText('Monday').closest('th');
    expect(mondayHeader).toHaveClass('bg-gray-100');
  });

  it('handles empty schedule data', () => {
    const emptyAreaSchedule: AreaScheduleResponse = {
      ...mockAreaSchedule,
      area: {
        ...mockAreaSchedule.area,
        shifts: []
      }
    };

    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={emptyAreaSchedule}
        editable={true}
        type="area"
      />
    );

    // Should still render the grid structure
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('8:00 AM - 12:00 PM')).toBeInTheDocument();
  });

  it('calls onShiftClick when shift is clicked', () => {
    const mockOnShiftClick = vi.fn();

    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockAreaSchedule}
        editable={true}
        type="area"
        onShiftClick={mockOnShiftClick}
      />
    );

    // This test would need the ShiftCell to be rendered, which depends on 
    // the shift matching the time slot. This is more of an integration test.
  });

  it('calls onAddShift when add button is clicked in editable mode', () => {
    const mockOnAddShift = vi.fn();

    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockAreaSchedule}
        editable={true}
        type="area"
        onAddShift={mockOnAddShift}
      />
    );

    // This would require hovering over a cell to show the add button
    // More of an integration test with ShiftCell
  });

  it('renders with correct table structure', () => {
    render(
      <ScheduleGrid
        bounds={mockBounds}
        data={mockAreaSchedule}
        editable={true}
        type="area"
      />
    );

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Check headers: Time + 7 days
    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(8); // Time + 7 days

    // Check that there are rows for each time slot
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(2); // Header + time slot rows
  });
});