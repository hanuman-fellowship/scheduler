import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalModalProvider } from '../../../contexts/GlobalModalContext';
import { ScheduleView } from '../ScheduleView';

// Mock the schedule view service
vi.mock('../../../services/scheduleView', () => ({
  scheduleViewService: {
    getAreaSchedule: vi.fn(),
    getPersonSchedule: vi.fn(),
    getGapsSchedule: vi.fn()
  }
}));

// Mock the stores
vi.mock('../../../store/scheduleStore', () => ({
  useScheduleStore: vi.fn(() => ({
    currentSchedule: { id: 1, name: 'Test Schedule', userId: 1, template: false, request: 0, createdAt: '', updatedAt: '' },
    isLoading: false,
    setCurrentSchedule: vi.fn(),
    clearCurrentSchedule: vi.fn(),
    loadCurrentSchedule: vi.fn(),
    switchToSchedule: vi.fn(),
    isEditable: vi.fn(() => false),
    isPublished: vi.fn(() => false),
    isRequest: vi.fn(() => false)
  }))
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
        <GlobalModalProvider>
          {component}
        </GlobalModalProvider>
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