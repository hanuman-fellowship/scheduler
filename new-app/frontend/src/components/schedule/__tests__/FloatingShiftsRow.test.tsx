import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingShiftsRow } from '../FloatingShiftsRow';
import type { FloatingShiftResponse } from '@shared/types';

describe('FloatingShiftsRow', () => {
  const mockFloatingShifts: FloatingShiftResponse[] = [
    {
      id: 1,
      areaId: 1,
      personId: 1,
      hours: 8,
      person: {
        id: 1,
        name: 'John Doe',
        first: 'John',
        last: 'Doe'
      }
    },
    {
      id: 2,
      areaId: 1,
      personId: 2,
      hours: 4,
      person: {
        id: 2,
        name: 'Jane Smith',
        first: 'Jane',
        last: 'Smith'
      }
    }
  ];

  it('should display floating shifts in legacy format', () => {
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={false}
          />
        </tbody>
      </table>
    );

    expect(screen.getByText(/Also 8 hours w\/ John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Also 4 hours w\/ Jane Smith/)).toBeInTheDocument();
  });

  it('should separate multiple floating shifts with commas', () => {
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={false}
          />
        </tbody>
      </table>
    );

    // Should have comma between the shifts
    const row = screen.getByRole('row');
    expect(row).toHaveTextContent('Also 8 hours w/ John Doe, Also 4 hours w/ Jane Smith');
  });

  it('should show add button when editable', () => {
    const mockOnAdd = vi.fn();
    
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={[]}
            editable={true}
            onAdd={mockOnAdd}
          />
        </tbody>
      </table>
    );

    const addButton = screen.getByLabelText('Add floating shift');
    expect(addButton).toBeInTheDocument();
    
    fireEvent.click(addButton);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('should show delete buttons when editable', () => {
    const mockOnDelete = vi.fn();
    
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={true}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    );

    const deleteButtons = screen.getAllByLabelText('Delete floating shift');
    expect(deleteButtons).toHaveLength(2);
    
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should call onEdit when shift is clicked in editable mode', () => {
    const mockOnEdit = vi.fn();
    
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={true}
            onEdit={mockOnEdit}
          />
        </tbody>
      </table>
    );

    const firstShift = screen.getByText(/Also 8 hours w\/ John Doe/);
    fireEvent.click(firstShift);
    expect(mockOnEdit).toHaveBeenCalledWith(1);
  });

  it('should not show interactive elements when not editable', () => {
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={false}
          />
        </tbody>
      </table>
    );

    expect(screen.queryByLabelText('Add floating shift')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Delete floating shift')).not.toBeInTheDocument();
  });

  it('should handle empty floating shifts array', () => {
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={[]}
            editable={false}
          />
        </tbody>
      </table>
    );

    // Should render empty row with container div
    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('colSpan', '8');
    // Should contain only the empty container div
    const container = cell.querySelector('.floating-shifts-container');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('should span the full table width', () => {
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={false}
          />
        </tbody>
      </table>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toHaveAttribute('colSpan', '8');
  });

  it('should prevent edit action propagation on delete button click', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(
      <table>
        <tbody>
          <FloatingShiftsRow 
            floatingShifts={mockFloatingShifts}
            editable={true}
            onEdit={mockOnEdit}
            onDelete={mockOnDelete}
          />
        </tbody>
      </table>
    );

    const deleteButton = screen.getAllByLabelText('Delete floating shift')[0];
    fireEvent.click(deleteButton);
    
    // Should call delete but not edit
    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnEdit).not.toHaveBeenCalled();
  });
});