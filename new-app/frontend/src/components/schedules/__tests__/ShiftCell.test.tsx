import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShiftCell } from '../ShiftCell';
import type { ShiftWithAssignments, TimeSlot } from '@shared/types';

const mockTimeSlot: TimeSlot = {
  id: '08:00-12:00',
  name: '8:00 AM - 12:00 PM',
  startTime: '08:00',
  endTime: '12:00'
};

const mockShift: ShiftWithAssignments = {
  id: 1,
  areaId: 1,
  dayId: 2,
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
};

const mockPersonShift: ShiftWithAssignments = {
  id: 1,
  areaId: 1,
  dayId: 2,
  start: '08:00',
  end: '12:00',
  numPeople: 1,
  scheduleId: 1,
  assignments: [
    {
      id: 1,
      shiftId: 1,
      personId: 1,
      name: undefined,
      star: true,
      area: {
        id: 1,
        name: 'Kitchen',
        shortName: 'K'
      }
    }
  ]
};

const mockGapsShift: ShiftWithAssignments = {
  id: 2,
  areaId: 1,
  dayId: 3,
  start: '13:00',
  end: '17:00',
  numPeople: 2,
  scheduleId: 1,
  assignments: []
};

describe('ShiftCell', () => {
  describe('Area view', () => {
    it('renders shift with assignments correctly', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      // Should show time range
      expect(screen.getByText('8AM-12PM')).toBeInTheDocument();

      // Should show assigned person
      expect(screen.getByText('John D')).toBeInTheDocument();
    });

    it('shows need for more people when underassigned', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      // Shift needs 2 people, has 1 assignment
      expect(screen.getByText('Need 1 more')).toBeInTheDocument();
    });

    it('shows star indicator for starred assignments', () => {
      const starredShift = {
        ...mockShift,
        assignments: [
          {
            ...mockShift.assignments[0],
            star: true
          }
        ]
      };

      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[starredShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('calls onShiftClick when shift is clicked', async () => {
      const user = userEvent.setup();
      const mockOnShiftClick = vi.fn();

      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
                onShiftClick={mockOnShiftClick}
              />
            </tr>
          </tbody>
        </table>
      );

      const shiftElement = screen.getByText('8AM-12PM').closest('div');
      await user.click(shiftElement!);

      expect(mockOnShiftClick).toHaveBeenCalledWith(1);
    });
  });

  describe('Person view', () => {
    it('renders person schedule shift correctly', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockPersonShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="person"
                editable={false}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      // Should show area short name
      expect(screen.getByText('K')).toBeInTheDocument();

      // Should show time range
      expect(screen.getByText('8AM-12PM')).toBeInTheDocument();

      // Should show star
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('falls back to area ID when short name not available', () => {
      const shiftWithoutArea = {
        ...mockPersonShift,
        assignments: [
          {
            ...mockPersonShift.assignments[0],
            area: undefined
          }
        ]
      };

      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[shiftWithoutArea]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="person"
                editable={false}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText('Area 1')).toBeInTheDocument();
    });
  });

  describe('Gaps view', () => {
    it('renders unassigned shift correctly', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockGapsShift]}
                dayId={3}
                timeSlot={{
                  id: '13:00-17:00',
                  name: '1:00 PM - 5:00 PM',
                  startTime: '13:00',
                  endTime: '17:00'
                }}
                type="gaps"
                editable={false}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      // Should show time range
      expect(screen.getByText('1PM-5PM')).toBeInTheDocument();

      // Should show need for people
      expect(screen.getByText('Need 2 people')).toBeInTheDocument();
    });

    it('shows "No gaps" message when no unassigned shifts', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[]}
                dayId={3}
                timeSlot={mockTimeSlot}
                type="gaps"
                editable={false}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      expect(screen.getByText('No gaps')).toBeInTheDocument();
    });
  });

  describe('Interactive features', () => {
    it('shows add button on hover in editable mode', async () => {
      const user = userEvent.setup();
      const mockOnAdd = vi.fn();

      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
                onAdd={mockOnAdd}
              />
            </tr>
          </tbody>
        </table>
      );

      const cell = screen.getByRole('cell');
      await user.hover(cell);

      expect(screen.getByText('+ Add')).toBeInTheDocument();
    });

    it('calls onAdd when add button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnAdd = vi.fn();

      const { container } = render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
                onAdd={mockOnAdd}
              />
            </tr>
          </tbody>
        </table>
      );

      const cell = container.querySelector('td')!;
      
      // Trigger hover manually using fireEvent instead of user.hover
      fireEvent.mouseEnter(cell);
      
      // Wait for the button to appear
      const addButton = await screen.findByText('+ Add');
      await user.click(addButton);

      expect(mockOnAdd).toHaveBeenCalledTimes(1);
    });

    it('does not show add button in read-only mode', async () => {
      const user = userEvent.setup();
      const mockOnAdd = vi.fn();

      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={false}
                isToday={false}
                onAdd={mockOnAdd}
              />
            </tr>
          </tbody>
        </table>
      );

      const cell = screen.getByRole('cell');
      await user.hover(cell);

      expect(screen.queryByText('+ Add')).not.toBeInTheDocument();
    });
  });

  describe('Visual styling', () => {
    it('applies today highlighting', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={true}
              />
            </tr>
          </tbody>
        </table>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('bg-yellow-50');
    });

    it('applies regular styling when not today', () => {
      render(
        <table>
          <tbody>
            <tr>
              <ShiftCell
                shifts={[mockShift]}
                dayId={2}
                timeSlot={mockTimeSlot}
                type="area"
                editable={true}
                isToday={false}
              />
            </tr>
          </tbody>
        </table>
      );

      const cell = screen.getByRole('cell');
      expect(cell).toHaveClass('bg-white');
    });
  });
});