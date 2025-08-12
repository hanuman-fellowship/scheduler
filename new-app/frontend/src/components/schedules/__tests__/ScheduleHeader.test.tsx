import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScheduleHeader } from '../ScheduleHeader';

describe('ScheduleHeader', () => {
  it('should display title and subtitle', () => {
    render(
      <ScheduleHeader
        title="Kitchen"
        subtitle="John Doe"
        editable={false}
        type="area"
      />
    );

    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Manager: John Doe')).toBeInTheDocument();
  });

  it('should display total hours for person schedules', () => {
    render(
      <ScheduleHeader
        title="Jane Smith"
        subtitle="Resident"
        editable={false}
        type="person"
        totalHours={40.5}
      />
    );

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Category: Resident')).toBeInTheDocument();
    expect(screen.getByText('40.5 hrs')).toBeInTheDocument();
  });

  it('should show edit button when editable', () => {
    const mockOnEdit = vi.fn();
    render(
      <ScheduleHeader
        title="Kitchen"
        subtitle="John Doe"
        editable={true}
        type="area"
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByTitle('Edit')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnEdit = vi.fn();

    render(
      <ScheduleHeader
        title="Kitchen"
        subtitle="John Doe"
        editable={true}
        type="area"
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByTitle('Edit');
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('should not show edit button when not editable', () => {
    render(
      <ScheduleHeader
        title="Kitchen"
        subtitle="John Doe"
        editable={false}
        type="area"
      />
    );

    expect(screen.queryByTitle('Edit')).not.toBeInTheDocument();
  });
});