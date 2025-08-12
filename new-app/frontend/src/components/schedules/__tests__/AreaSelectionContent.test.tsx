import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AreaSelectionContent } from '../AreaSelectionContent';
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

describe('AreaSelectionContent', () => {
  const mockOnCancel = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(scheduleNavService.scheduleNavigationService.getAreasForSelection).mockResolvedValue([]);
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedArea).mockReturnValue(null);

    renderWithProviders(
      <AreaSelectionContent onCancel={mockOnCancel} />
    );
    
    expect(screen.getByText('Loading areas...')).toBeInTheDocument();
  });

  it('should handle area selection and navigation', async () => {
    const user = userEvent.setup();
    const mockAreas = [
      { id: 1, name: 'Kitchen', shortName: 'K' }
    ];

    vi.mocked(scheduleNavService.scheduleNavigationService.getAreasForSelection).mockResolvedValue(mockAreas);
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedArea).mockReturnValue(null);
    vi.mocked(scheduleNavService.scheduleNavigationService.navigateToAreaSchedule).mockReturnValue('/schedule-view/area/1');

    renderWithProviders(
      <AreaSelectionContent onCancel={mockOnCancel} />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Kitchen'));

    expect(scheduleNavService.scheduleNavigationService.navigateToAreaSchedule).toHaveBeenCalledWith(1);
    expect(mockNavigate).toHaveBeenCalledWith('/schedule-view/area/1');
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should handle cancel button', async () => {
    const user = userEvent.setup();
    vi.mocked(scheduleNavService.scheduleNavigationService.getAreasForSelection).mockResolvedValue([]);
    vi.mocked(scheduleNavService.scheduleNavigationService.getLastSelectedArea).mockReturnValue(null);

    renderWithProviders(
      <AreaSelectionContent onCancel={mockOnCancel} />
    );
    
    await waitFor(() => {
      expect(screen.getByText('No areas found')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});