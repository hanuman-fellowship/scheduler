import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersonSelectionContent } from '../PersonSelectionContent';
import * as scheduleNavService from '../../../services/scheduleNavigation';

// Mock the navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock the service
vi.mock('../../../services/scheduleNavigation');

const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = createQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('PersonSelectionContent', () => {
  const mockOnCancel = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(scheduleNavService.scheduleNavigationService.getPeopleForSelection).mockResolvedValue({});
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedPerson).mockReturnValue(null);

    renderWithProviders(
      <PersonSelectionContent onCancel={mockOnCancel} />
    );
    
    expect(screen.getByText('Loading people...')).toBeInTheDocument();
  });

  it('should display people grouped by category', async () => {
    const mockPeopleByCategory = {
      'Residents': [
        { id: 1, name: 'John D', first: 'John', last: 'Doe', category: { id: 1, name: 'Residents', color: '#blue' } }
      ]
    };

    vi.mocked(scheduleNavService.scheduleNavigationService.getPeopleForSelection).mockResolvedValue(mockPeopleByCategory);
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedPerson).mockReturnValue(null);

    renderWithProviders(
      <PersonSelectionContent onCancel={mockOnCancel} />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Residents')).toBeInTheDocument();
      expect(screen.getByText('John D')).toBeInTheDocument();
    });
  });

  it('should handle person selection and navigation', async () => {
    const user = userEvent.setup();
    const mockPeopleByCategory = {
      'Residents': [
        { id: 1, name: 'John D', first: 'John', last: 'Doe', category: { id: 1, name: 'Residents', color: '#blue' } }
      ]
    };

    vi.mocked(scheduleNavService.scheduleNavigationService.getPeopleForSelection).mockResolvedValue(mockPeopleByCategory);
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedPerson).mockReturnValue(null);
    vi.mocked(scheduleNavService.scheduleNavigationService.navigateToPersonSchedule).mockReturnValue('/schedule-view/person/1');

    renderWithProviders(
      <PersonSelectionContent onCancel={mockOnCancel} />
    );
    
    await waitFor(() => {
      expect(screen.getByText('John D')).toBeInTheDocument();
    });

    await user.click(screen.getByText('John D'));

    expect(scheduleNavService.scheduleNavigationService.navigateToPersonSchedule).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/schedule-view/person/1');
    expect(mockOnCancel).toHaveBeenCalled();
  });

  // Cancel button removed; closing handled by parent Modal backdrop
});