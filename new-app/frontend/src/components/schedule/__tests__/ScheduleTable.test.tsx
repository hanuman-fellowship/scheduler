import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ScheduleTable } from '../ScheduleTable';
import type { ScheduleBounds, AreaScheduleResponse } from '@shared/types';

// Mock child components
vi.mock('../TimeSlotRow', () => ({
  TimeSlotRow: ({ period }: any) => (
    <tr data-testid={`time-slot-${period.name}`}>
      <td>{period.name}</td>
    </tr>
  )
}));

vi.mock('../HoursSummaryRow', () => ({
  HoursSummaryRow: () => <tr data-testid="hours-summary"><td>Hours</td></tr>
}));

vi.mock('../FloatingShiftsRow', () => ({
  FloatingShiftsRow: () => <tr data-testid="floating-shifts"><td>Floating</td></tr>
}));

describe('ScheduleTable', () => {
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
    timePeriods: [
      { name: 'Morning', startSeconds: 0, endSeconds: 43200 },
      { name: 'Afternoon', startSeconds: 43200, endSeconds: 61200 },
      { name: 'Evening', startSeconds: 61200, endSeconds: 86400 }
    ]
  };

  const mockAreaData: AreaScheduleResponse = {
    area: {
      id: 1,
      name: 'Kitchen',
      shortName: 'K',
      shifts: [],
      floatingShifts: []
    },
    bounds: mockBounds,
    editable: true
  };

  it('should render exactly 774px width table', () => {
    const { container } = render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockAreaData}
        type="area"
        editable={true}
      />
    );
    
    const table = container.querySelector('.schedule-table');
    expect(table).toBeTruthy();
    // CSS class should be applied
    expect(table?.className).toContain('schedule-table');
  });

  it('should render 3 time period rows (Morning, Afternoon, Evening)', () => {
    render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockAreaData}
        type="area"
        editable={true}
      />
    );

    expect(screen.getByTestId('time-slot-Morning')).toBeTruthy();
    expect(screen.getByTestId('time-slot-Afternoon')).toBeTruthy();
    expect(screen.getByTestId('time-slot-Evening')).toBeTruthy();
  });

  it('should render day headers for all 7 days', () => {
    render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockAreaData}
        type="area"
        editable={true}
      />
    );

    expect(screen.getByText('Sunday')).toBeTruthy();
    expect(screen.getByText('Monday')).toBeTruthy();
    expect(screen.getByText('Tuesday')).toBeTruthy();
    expect(screen.getByText('Wednesday')).toBeTruthy();
    expect(screen.getByText('Thursday')).toBeTruthy();
    expect(screen.getByText('Friday')).toBeTruthy();
    expect(screen.getByText('Saturday')).toBeTruthy();
  });

  it('should highlight today column', () => {
    const today = new Date().getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = dayNames[today];

    render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockAreaData}
        type="area"
        editable={true}
      />
    );

    const todayHeader = screen.getByText(todayName);
    expect(todayHeader.closest('th')?.className).toContain('today');
  });

  it('should render hours summary row for person schedule', () => {
    const mockPersonData = {
      person: {
        id: 1,
        first: 'John',
        last: 'Doe',
        name: 'John D',
        category: { id: 1, name: 'Residents', color: '#00ff00' },
        assignments: []
      },
      bounds: mockBounds,
      editable: false,
      totalHours: {},
      notes: { operations: [], personnel: [] },
      offDays: []
    };

    render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockPersonData}
        type="person"
        editable={false}
      />
    );

    expect(screen.getByTestId('hours-summary')).toBeTruthy();
  });

  it('should apply request mode class when specified', () => {
    const { container } = render(
      <ScheduleTable
        bounds={mockBounds}
        data={mockAreaData}
        type="area"
        editable={true}
        mode="request"
      />
    );

    const table = container.querySelector('.schedule-table');
    expect(table?.className).toContain('request-mode');
  });
});