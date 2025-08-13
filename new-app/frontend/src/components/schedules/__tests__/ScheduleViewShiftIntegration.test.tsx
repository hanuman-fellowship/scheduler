import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ScheduleView } from '../ScheduleView'
import { useScheduleStore } from '../../../store/scheduleStore'
import { useGlobalModal } from '../../../contexts/GlobalModalContext'
import { useScheduleView } from '../../../hooks/useScheduleView'

// Mock the stores and hooks
vi.mock('../../../store/scheduleStore')
vi.mock('../../../contexts/GlobalModalContext')
vi.mock('../../../hooks/useScheduleView')

// Mock React Router params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ type: 'area', id: '1' }),
    useSearchParams: () => [new URLSearchParams()]
  }
})

const mockUseScheduleStore = vi.mocked(useScheduleStore)
const mockUseGlobalModal = vi.mocked(useGlobalModal)
const mockUseScheduleView = vi.mocked(useScheduleView)

const mockOpenModal = vi.fn()

const mockAreaScheduleData = {
  area: {
    id: 1,
    name: 'Kitchen',
    manager: { username: 'manager1' },
    shifts: [
      {
        id: 1,
        dayId: 1,
        startAtSeconds: 28800, // 8:00 AM
        endAtSeconds: 32400, // 9:00 AM
        assignments: []
      }
    ],
    floatingShifts: []
  },
  bounds: {
    days: { 1: 'Sunday', 2: 'Monday', 3: 'Tuesday', 4: 'Wednesday', 5: 'Thursday', 6: 'Friday', 7: 'Saturday' },
    timePeriods: [
      { name: 'Morning', startSeconds: 0, endSeconds: 43200 },
      { name: 'Afternoon', startSeconds: 43200, endSeconds: 61200 },
      { name: 'Evening', startSeconds: 61200, endSeconds: 86400 }
    ]
  },
  editable: true
}

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ScheduleView Shift Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: { id: 1, name: 'Test Schedule', userId: 1, template: false, request: 0, createdAt: '', updatedAt: '' },
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => true),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    mockUseGlobalModal.mockReturnValue({
      openModal: mockOpenModal,
      closeModal: vi.fn(),
      openAreaSelectionModal: vi.fn(),
      openPersonSelectionModal: vi.fn(),
      openEditCategoryModal: vi.fn(),
      openDeleteCategoryModal: vi.fn(),
      openInProgressSchedulesModal: vi.fn(),
      openPublishedSchedulesModal: vi.fn()
    })

    mockUseScheduleView.mockReturnValue({
      data: mockAreaScheduleData,
      isLoading: false,
      error: null
    })
  })

  it('should render add shift buttons when schedule is editable', async () => {
    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Add shift buttons should be present but hidden initially (CSS opacity: 0)
    const addButtons = screen.getAllByLabelText(/Add shift for/i)
    expect(addButtons.length).toBeGreaterThan(0)
  })

  it('should call openModal with correct context when add shift button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Find and click an add shift button
    const addButton = screen.getByLabelText('Add shift for Morning on day 1')
    await user.click(addButton)

    expect(mockOpenModal).toHaveBeenCalledWith('shift', {
      dayId: 1,
      periodName: 'Morning',
      scheduleType: 'area',
      scheduleId: 1,
      areaId: 1,
      personId: undefined
    })
  })

  it('should not show add shift buttons when schedule is not editable', async () => {
    // Make schedule not editable
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: { id: 1, name: 'Test Schedule', userId: 2, template: false, request: 0, createdAt: '', updatedAt: '' },
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isPublished: vi.fn(() => true),
      isRequest: vi.fn(() => false)
    })

    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Add shift buttons should not be present
    const addButtons = screen.queryAllByLabelText(/Add shift for/i)
    expect(addButtons).toHaveLength(0)
  })

  it('should handle floating shift creation', async () => {
    const user = userEvent.setup()
    
    // Add a floating shift to the data to render the floating shifts row
    const dataWithFloatingShift = {
      ...mockAreaScheduleData,
      area: {
        ...mockAreaScheduleData.area,
        floatingShifts: [{ id: 1, hours: 8 }]
      }
    }
    
    mockUseScheduleView.mockReturnValue({
      data: dataWithFloatingShift,
      isLoading: false,
      error: null
    })

    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Find and click the add floating shift button
    const addFloatingButton = screen.getByLabelText('Add floating shift')
    await user.click(addFloatingButton)

    expect(mockOpenModal).toHaveBeenCalledWith('shift', {
      scheduleType: 'area',
      scheduleId: 1,
      areaId: 1,
      personId: undefined,
      floating: true
    })
  })

  it('should handle shift context for different schedule types', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Click add shift button for area schedule
    const addButton = screen.getByLabelText('Add shift for Afternoon on day 2')
    await user.click(addButton)

    expect(mockOpenModal).toHaveBeenCalledWith('shift', {
      dayId: 2,
      periodName: 'Afternoon',
      scheduleType: 'area',
      scheduleId: 1,
      areaId: 1,
      personId: undefined
    })
  })
})