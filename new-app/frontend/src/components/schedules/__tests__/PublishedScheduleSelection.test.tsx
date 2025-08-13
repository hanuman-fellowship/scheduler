import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PublishedScheduleSelection } from '../PublishedScheduleSelection'
import { useScheduleStore } from '../../../store/scheduleStore'
import { schedulesService } from '../../../services/schedules'

// Mock the stores and services
vi.mock('../../../store/scheduleStore')
vi.mock('../../../services/schedules')

const mockSwitchToSchedule = vi.fn()
const mockUseScheduleStore = vi.mocked(useScheduleStore)
const mockSchedulesService = vi.mocked(schedulesService)

const mockPublishedSchedules = [
  {
    id: 10,
    name: 'Published',
    userId: null,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 11,
    name: 'Published',
    userId: null,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 12,
    name: 'Published',
    userId: null,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2023-12-15T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z'
  },
  {
    id: 13,
    name: 'Working Schedule',
    userId: 1,
    template: false,
    request: 0 as 0 | 1 | 2,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
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

describe('PublishedScheduleSelection', () => {
  const mockOnCancel = vi.fn()
  const mockOnScheduleSelected = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockPublishedSchedules[0],
      switchToSchedule: mockSwitchToSchedule,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      isLoading: false
    })

    mockSchedulesService.getSchedules.mockResolvedValue({ mine: mockPublishedSchedules })
  })

  it('should render loading state initially', () => {
    mockSchedulesService.getSchedules.mockReturnValue(new Promise(() => {})) // Never resolves
    
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    expect(screen.getByText('Loading published schedules...')).toBeInTheDocument()
  })

  it('should render published schedules grouped by year', async () => {
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('2024 (2 schedules)')).toBeInTheDocument()
      expect(screen.getByText('2023 (1 schedules)')).toBeInTheDocument()
    })

    // Should NOT show working schedule (userId is not null)
    expect(screen.queryByText('Working Schedule')).not.toBeInTheDocument()
  })

  it('should expand/collapse year groups', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('2024 (2 schedules)')).toBeInTheDocument()
    })

    // 2024 should be expanded by default (shows schedules)
    expect(screen.getByText(/Published - 2\/14\/2024/)).toBeInTheDocument()
    expect(screen.getByText(/Published - 1\/14\/2024/)).toBeInTheDocument()

    // Click to collapse 2024
    const year2024Button = screen.getByText('2024 (2 schedules)')
    await user.click(year2024Button)

    // Schedules should be hidden
    expect(screen.queryByText(/Published - 2\/14\/2024/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Published - 1\/14\/2024/)).not.toBeInTheDocument()

    // Click to expand again
    await user.click(year2024Button)

    // Schedules should be visible again
    expect(screen.getByText(/Published - 2\/14\/2024/)).toBeInTheDocument()
    expect(screen.getByText(/Published - 1\/14\/2024/)).toBeInTheDocument()
  })

  it('should highlight current schedule', async () => {
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('✓ Current')).toBeInTheDocument()
    })

    const currentScheduleButton = screen.getByText(/Published - 1\/14\/2024/).closest('button')
    expect(currentScheduleButton).toHaveClass('bg-blue-50', 'font-semibold', 'border-blue-500')
  })

  it('should handle schedule selection', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Published - 2\/14\/2024/)).toBeInTheDocument()
    })

    const scheduleButton = screen.getByText(/Published - 2\/14\/2024/)
    await user.click(scheduleButton)

    expect(mockSwitchToSchedule).toHaveBeenCalledWith(mockPublishedSchedules[1])
  })

  // Cancel button removed; clicking backdrop closes via parent modal

  it('should display current schedule info', async () => {
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Current: Published')).toBeInTheDocument()
    })
  })

  it('should handle error state', async () => {
    mockSchedulesService.getSchedules.mockRejectedValue(new Error('Network error'))
    
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText(/Error loading schedules/)).toBeInTheDocument()
      expect(screen.getByText(/Network error/)).toBeInTheDocument()
    })
  })

  it('should show empty state when no published schedules found', async () => {
    // Return only working schedules (userId is not null)
    mockSchedulesService.getSchedules.mockResolvedValue({ mine: [mockPublishedSchedules[3]] })
    
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('No published schedules found')).toBeInTheDocument()
    })
  })

  it('should sort schedules by year (newest first) and within year by date (newest first)', async () => {
    renderWithQueryClient(
      <PublishedScheduleSelection
        onCancel={mockOnCancel}
        onScheduleSelected={mockOnScheduleSelected}
      />
    )

    await waitFor(() => {
      const yearButtons = screen.getAllByText(/\d{4} \(\d+ schedules\)/)
      expect(yearButtons[0]).toHaveTextContent('2024')
      expect(yearButtons[1]).toHaveTextContent('2023')
    })

    // Within 2024, Feb (2/14) should come before Jan (1/14)
    const scheduleButtons = screen.getAllByText(/Published - \d+\/14\/2024/)
    expect(scheduleButtons[0]).toHaveTextContent('2/14/2024') // February first
    expect(scheduleButtons[1]).toHaveTextContent('1/14/2024') // January second
  })
})