import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import EditShiftForm from '../EditShiftForm'
import { shiftService } from '../../../services/shifts'
import { areasService } from '../../../services/areas'
import { daysService } from '../../../services/days'
import { useScheduleStore } from '../../../store/scheduleStore'

// Mock the services
vi.mock('../../../services/shifts')
vi.mock('../../../services/areas')
vi.mock('../../../services/days')
vi.mock('../../../store/scheduleStore')

const mockShiftService = vi.mocked(shiftService)
const mockAreasService = vi.mocked(areasService)
const mockDaysService = vi.mocked(daysService)
const mockUseScheduleStore = vi.mocked(useScheduleStore)

const mockShift = {
  id: 1,
  areaId: 1,
  dayId: 1,
  startAtSeconds: 32400, // 9:00 AM
  endAtSeconds: 36000, // 10:00 AM
  numPeople: 2,
  scheduleId: 1,
  assignments: [
    { id: 1, personId: 1, name: 'John Doe', star: false }
  ]
}

const mockAreas = [
  { id: 1, name: 'Kitchen', shortName: 'K', scheduleId: 1 },
  { id: 2, name: 'Dining', shortName: 'D', scheduleId: 1 }
]

const mockDays = [
  { id: 1, name: 'Sunday', dayOfWeek: 0, date: null },
  { id: 2, name: 'Monday', dayOfWeek: 1, date: null }
]

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

describe('EditShiftForm', () => {
  const mockOnSuccess = vi.fn()
  const mockOnCancel = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    mockUseScheduleStore.mockReturnValue({
      currentSchedule: { id: 1, name: 'Test Schedule', userId: 1, template: false, request: 0, createdAt: '', updatedAt: '' },
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(),
      isPublished: vi.fn(),
      isRequest: vi.fn()
    })

    mockShiftService.getShift.mockResolvedValue(mockShift)
    mockAreasService.getAreas.mockResolvedValue(mockAreas)
    mockDaysService.getDays.mockResolvedValue(mockDays)
  })

  it('should load and display shift data', async () => {
    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
      />
    )

    await waitFor(() => {
      expect(mockShiftService.getShift).toHaveBeenCalledWith(1)
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Sunday')).toBeInTheDocument()
      expect(screen.getByDisplayValue('09:00')).toBeInTheDocument()
      expect(screen.getByDisplayValue('10:00')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    })
  })

  it('should show loading state while fetching shift', () => {
    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('Loading shift details...')).toBeInTheDocument()
  })

  it('should handle form submission with updated data', async () => {
    const user = userEvent.setup()
    mockShiftService.updateShift.mockResolvedValue(mockShift)

    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
    })

    // Change the number of people
    const numPeopleInput = screen.getByLabelText('Number of People:')
    await user.clear(numPeopleInput)
    await user.type(numPeopleInput, '3')

    // Submit form
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    await waitFor(() => {
      expect(mockShiftService.updateShift).toHaveBeenCalledWith(1, {
        areaId: 1,
        dayId: 1,
        startAtSeconds: 32400, // 9:00 AM
        endAtSeconds: 36000, // 10:00 AM
        numPeople: 3
      })
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('should handle shift deletion', async () => {
    const user = userEvent.setup()
    mockShiftService.deleteShift.mockResolvedValue(undefined)
    
    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
    })

    // Click delete button
    await user.click(screen.getByRole('button', { name: 'Delete Shift' }))

    await waitFor(() => {
      expect(mockShiftService.deleteShift).toHaveBeenCalledWith(1)
    })

    expect(mockOnDelete).toHaveBeenCalled()
    confirmSpy.mockRestore()
  })

  it('should allow setting number of people without assignment constraints', async () => {

    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
    })

    // Check that min value is set to 1 (no assignment constraints)
    const numPeopleInput = screen.getByLabelText('Number of People:') as HTMLInputElement
    expect(numPeopleInput.min).toBe('1')
    
    // Should NOT show assignment info since it's been removed from edit modal
    expect(screen.queryByText(/Currently assigned/)).not.toBeInTheDocument()
  })

  it('should handle cancel button', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should handle errors when loading shift fails', async () => {
    mockShiftService.getShift.mockRejectedValue(new Error('Shift not found'))

    renderWithProviders(
      <EditShiftForm
        shiftId={999}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('Failed to load shift details. Please try again.')).toBeInTheDocument()
    })
  })

  it('should auto-calculate end time when start time changes', async () => {
    const user = userEvent.setup()

    renderWithProviders(
      <EditShiftForm
        shiftId={1}
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    )

    // Wait for form to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('09:00')).toBeInTheDocument()
    })

    // Change start time
    const startTimeInput = screen.getByLabelText('Start Time:')
    await user.clear(startTimeInput)
    await user.type(startTimeInput, '14:00')

    // End time should automatically update to one hour later
    await waitFor(() => {
      const endTimeInput = screen.getByLabelText('End Time:') as HTMLInputElement
      expect(endTimeInput.value).toBe('15:00')
    })
  })
})