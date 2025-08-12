import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ScheduleView } from '../ScheduleView';

// Mock the schedule view service
vi.mock('../../../services/scheduleView', () => ({
  scheduleViewService: {
    getAreaSchedule: vi.fn(),
    getPersonSchedule: vi.fn(),
    getGapsSchedule: vi.fn()
  }
}));

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams()])
  };
});

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

describe('ScheduleView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state initially', async () => {
    const { useParams } = vi.mocked(await import('react-router-dom'));
    useParams.mockReturnValue({ type: 'area', id: '1' });

    renderWithProviders(<ScheduleView />);
    
    expect(screen.getByText('Loading schedule...')).toBeInTheDocument();
  });

  it('should show error state when invalid parameters are provided', async () => {
    const { useParams } = vi.mocked(await import('react-router-dom'));
    useParams.mockReturnValue({ type: 'invalid', id: '1' });

    renderWithProviders(<ScheduleView />);
    
    expect(screen.getByText(/Error loading schedule/)).toBeInTheDocument();
  });

  it('should show error state when no parameters are provided', async () => {
    const { useParams } = vi.mocked(await import('react-router-dom'));
    useParams.mockReturnValue({});

    renderWithProviders(<ScheduleView />);
    
    expect(screen.getByText(/Error loading schedule/)).toBeInTheDocument();
  });
});