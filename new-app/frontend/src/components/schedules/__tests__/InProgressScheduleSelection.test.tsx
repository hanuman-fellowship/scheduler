import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { InProgressScheduleSelection } from '../InProgressScheduleSelection'
import { useScheduleStore } from '../../../store/scheduleStore'
import { useAuthStore } from '../../../store/authStore'
import { schedulesService } from '../../../services/schedules'

// Mock the stores
vi.mock('../../../store/scheduleStore')
vi.mock('../../../store/authStore')
vi.mock('../../../services/schedules')

const mockSwitchToSchedule = vi.fn()
const mockUseScheduleStore = vi.mocked(useScheduleStore)
const mockUseAuthStore = vi.mocked(useAuthStore)
const mockSchedulesService = vi.mocked(schedulesService)

const mockSchedules = [
  {
    id: 1,
    name: 'My Working Schedule',
    userId: 1,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Other User Schedule',
    userId: 2,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Published Schedule',
    userId: null,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  }
]

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('InProgressScheduleSelection', () => {
  const mockOnCancel = vi.fn()
  const mockOnScheduleSelected = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockSchedules[0],
      switchToSchedule: mockSwitchToSchedule,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      isLoading: false
    })

    mockUseAuthStore.mockReturnValue({
      user: { id: 1, username: 'testuser', email: 'test@example.com', roles: ['operations'] },
      token: 'mock-token',
      login: vi.fn(),
      logout: vi.fn(),
      isOperations: vi.fn(() => true),
      isManager: vi.fn(() => false),
      isPersonnel: vi.fn(() => false)
    })

    mockSchedulesService.getSchedules.mockResolvedValue({ 
      mine: mockSchedules.filter(s => s.userId === 1), // Only user's own schedules
      all: mockSchedules // All schedules for operations users
    })
  })

  it('should render loading state initially', () => {
    mockSchedulesService.getSchedules.mockReturnValue(new Promise(() => {})) // Never resolves
    
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    expect(screen.getByText('Loading schedules...')).toBeInTheDocument()
  })

  it('should render schedules grouped by user', async () => {
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('My Schedules')).toBeInTheDocument()
      expect(screen.getByText('Other Schedules')).toBeInTheDocument()
    })

    // Should show user's own schedule
    expect(screen.getByText('My Working Schedule')).toBeInTheDocument()
    
    // Should show other user's schedule  
    expect(screen.getByText('Other User Schedule')).toBeInTheDocument()
    
    // Should NOT show published schedule (userId is null)
    expect(screen.queryByText('Published Schedule')).not.toBeInTheDocument()
  })

  it('should highlight current schedule', async () => {
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('✓ Current')).toBeInTheDocument()
    })

    const currentScheduleButton = screen.getByText('My Working Schedule').closest('button')
    expect(currentScheduleButton).toHaveClass('bg-blue-50', 'font-semibold', 'border-blue-500')
  })

  it('should handle schedule selection', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Other User Schedule')).toBeInTheDocument()
    })

    const otherScheduleButton = screen.getByText('Other User Schedule')
    await user.click(otherScheduleButton)

    expect(mockSwitchToSchedule).toHaveBeenCalledWith(mockSchedules[1])
  })

  // Cancel button removed; modal is closed via backdrop in parent Modal

  it('should display current schedule info', async () => {
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Current: My Working Schedule')).toBeInTheDocument()
    })
  })

  it('should handle error state', async () => {
    mockSchedulesService.getSchedules.mockRejectedValue(new Error('Failed to load'))
    
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Error loading schedules/)).toBeInTheDocument()
      expect(screen.getByText(/Failed to load/)).toBeInTheDocument()
    })
  })

  it('should show empty state when no schedules found', async () => {
    mockSchedulesService.getSchedules.mockResolvedValue({ mine: [] })
    
    renderWithQueryClient(
      <InProgressScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getAllByText('No schedules found')).toHaveLength(2) // One for each section
    })
  })
})