import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AssignmentModal } from '../AssignmentModal';
import { assignmentService } from '../../../services/assignmentService';
import type { AvailablePersonResponse } from '@shared/types';

// Mock the assignment service
vi.mock('../../../services/assignmentService', () => ({
  assignmentService: {
    getAvailablePeople: vi.fn(),
    createAssignment: vi.fn(),
  }
}));

// Mock the Modal component
vi.mock('../../ui/Modal', () => ({
  default: ({ isOpen, onClose, title, children, actions }: any) => 
    isOpen ? (
      <div role="dialog" aria-label={title}>
        <h2>{title}</h2>
        {actions && <div className="actions">{actions}</div>}
        {children}
      </div>
    ) : null
}));

const mockAvailablePeople: AvailablePersonResponse[] = [
  {
    id: 1,
    name: 'John Doe',
    category: { id: 1, name: 'Residents', color: '#008080' },
    available: true
  },
  {
    id: 2,
    name: 'Jane Smith',
    category: { id: 1, name: 'Residents', color: '#008080' },
    available: false,
    conflictReason: 'Time conflict'
  },
  {
    id: 3,
    name: 'Bob Johnson',
    category: { id: 2, name: 'Staff', color: '#FF0000' },
    available: true
  }
];

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('AssignmentModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with shift name', async () => {
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    expect(screen.getByText('Assign')).toBeInTheDocument();
  });

  it('should load and display available people grouped by category', async () => {
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Residents')).toBeInTheDocument();
      expect(screen.getByText('Staff')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });
  });

  it('should hide people with conflicts by default', async () => {
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Jane Smith has a conflict and should not be visible by default
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should show people with conflicts when checkbox is checked', async () => {
    const user = userEvent.setup();
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={vi.fn()}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Check the "Ignore Conflicts" checkbox
    const checkbox = screen.getByLabelText('Ignore Conflicts');
    await user.click(checkbox);

    // Now Jane Smith should be visible with conflict reason
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    // The conflict reason is in a title attribute and hidden span
    expect(screen.getByTitle('Time conflict')).toBeInTheDocument();
  });

  it('should assign a person when clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    vi.mocked(assignmentService.createAssignment).mockResolvedValue({
      id: 1,
      shiftId: 1,
      personId: 1,
      star: false
    });
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={onClose}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    await user.click(screen.getByText('John Doe'));

    expect(assignmentService.createAssignment).toHaveBeenCalledWith({
      shiftId: 1,
      personId: 1,
      name: undefined,
      communityHours: false,
      recurring: false
    });
  });

  it('should allow assigning "other" with custom name', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    vi.mocked(assignmentService.getAvailablePeople).mockResolvedValue(mockAvailablePeople);
    vi.mocked(assignmentService.createAssignment).mockResolvedValue({
      id: 1,
      shiftId: 1,
      personId: null,
      name: 'Contractor',
      star: false
    });
    
    renderWithProviders(
      <AssignmentModal
        isOpen={true}
        onClose={onClose}
        shiftId={1}
        shiftName="Morning Shift"
      />
    );

    const otherInput = screen.getByPlaceholderText('Other assignment name...');
    await user.type(otherInput, 'Contractor');
    await user.keyboard('{Enter}');

    expect(assignmentService.createAssignment).toHaveBeenCalledWith({
      shiftId: 1,
      personId: null,
      name: 'Contractor',
      communityHours: false,
      recurring: false
    });
  });
});