import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ShiftCell } from '../ShiftCell';
import type { ShiftWithAssignments } from '@shared/types';

// Mock ShiftBlock component
vi.mock('../ShiftBlock', () => ({
  ShiftBlock: ({ shift, isFirst }: any) => (
    <span 
      data-testid={`shift-${shift.id}`}
      className={`shift ${isFirst ? '' : 'stacked'}`}
    >
      Shift {shift.id}
    </span>
  )
}));

describe('ShiftCell - Legacy Stacking', () => {
  const mockShift1: ShiftWithAssignments = {
    id: 1,
    areaId: 1,
    dayId: 1,
    startAtSeconds: 28800, // 8:00 AM
    endAtSeconds: 43200,   // 12:00 PM
    numPeople: 2,
    assignments: []
  };

  const mockShift2: ShiftWithAssignments = {
    id: 2,
    areaId: 1,
    dayId: 1,
    startAtSeconds: 30600, // 8:30 AM
    endAtSeconds: 45000,   // 12:30 PM
    numPeople: 1,
    assignments: []
  };

  const mockShift3: ShiftWithAssignments = {
    id: 3,
    areaId: 1,
    dayId: 1,
    startAtSeconds: 32400, // 9:00 AM
    endAtSeconds: 46800,   // 1:00 PM
    numPeople: 1,
    assignments: []
  };

  it('should stack multiple shifts with proper CSS classes', () => {
    const shifts = [mockShift1, mockShift2, mockShift3];
    const { container } = render(
      <ShiftCell
        shifts={shifts}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={false}
        isToday={false}
      />
    );

    const shiftBlocks = container.querySelectorAll('.shift');
    expect(shiftBlocks).toHaveLength(3);
    
    // First shift should not have stacked class
    expect(shiftBlocks[0].className).not.toContain('stacked');
    
    // Subsequent shifts should have stacked class (for 20px padding)
    expect(shiftBlocks[1].className).toContain('stacked');
    expect(shiftBlocks[2].className).toContain('stacked');
  });

  it('should render empty cell with no placeholder content', () => {
    const { container } = render(
      <ShiftCell
        shifts={[]}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={false}
        isToday={false}
      />
    );

    const cell = container.querySelector('.shift-cell');
    expect(cell?.textContent?.trim()).toBe('');
    
    // Should not have any placeholder text
    expect(screen.queryByText('No shifts')).toBeFalsy();
    expect(screen.queryByText('Empty')).toBeFalsy();
    expect(screen.queryByText('—')).toBeFalsy();
  });

  it('should apply today class when isToday is true', () => {
    const { container } = render(
      <ShiftCell
        shifts={[mockShift1]}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={false}
        isToday={true}
      />
    );

    const cell = container.querySelector('.shift-cell');
    expect(cell?.className).toContain('today');
  });

  it('should show add button in editable mode', () => {
    render(
      <ShiftCell
        shifts={[]}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={true}
        isToday={false}
      />
    );

    const addButton = screen.getByLabelText('Add shift for Morning on day 1');
    expect(addButton).toBeTruthy();
    expect(addButton.textContent).toBe('+');
  });

  it('should call onAdd when add button is clicked', () => {
    const mockOnAdd = vi.fn();
    
    render(
      <ShiftCell
        shifts={[]}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={true}
        isToday={false}
        onAdd={mockOnAdd}
      />
    );

    const addButton = screen.getByLabelText('Add shift for Morning on day 1');
    fireEvent.click(addButton);
    
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('should have correct test id for integration tests', () => {
    const { container } = render(
      <ShiftCell
        shifts={[]}
        dayId={1}
        periodName="Morning"
        type="area"
        editable={false}
        isToday={false}
      />
    );

    const cell = container.querySelector('[data-testid="morning-1"]');
    expect(cell).toBeTruthy();
  });
});