import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AddShiftForm from '../AddShiftForm'
import { useScheduleStore } from '../../../store/scheduleStore'

// Mock the services
vi.mock('../../../services/shifts', () => ({
  shiftService: {
    createShift: vi.fn()
  }
}))

vi.mock('../../../services/areas', () => ({
  areasService: {
    getAreas: vi.fn()
  }
}))

vi.mock('../../../services/days', () => ({
  daysService: {
    getDays: vi.fn()
  }
}))

// Mock the schedule store
vi.mock('../../../store/scheduleStore')

describe('AddShiftForm', () => {
  let queryClient: QueryClient
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnCancel: ReturnType<typeof vi.fn>

  const mockSchedule = {
    id: 1,
    name: 'Test Schedule',
    userId: 1,
    template: false,
    request: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }

  const mockAreas = [
    { id: 1, scheduleId: 1, name: 'Kitchen', shortName: 'K' },
    { id: 2, scheduleId: 1, name: 'Dining Room', shortName: 'DR' }
  ]

  const mockDays = [
    { id: 1, name: 'Sunday', dayOfWeek: 1, date: null },
    { id: 2, name: 'Monday', dayOfWeek: 2, date: null },
    { id: 3, name: 'Tuesday', dayOfWeek: 3, date: null }
  ]

  beforeEach(async () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    mockOnSuccess = vi.fn()
    mockOnCancel = vi.fn()

    // Mock the schedule store
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: mockSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn()
    })

    // Mock the services to return our test data
    const { areasService } = await import('../../../services/areas')
    const { daysService } = await import('../../../services/days')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)
    vi.mocked(daysService.getDays).mockResolvedValue(mockDays)
  })

  const renderWithProviders = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddShiftForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
          {...props}
        />
      </QueryClientProvider>
    )
  }

  it('should render form elements', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByLabelText('Area:')).toBeInTheDocument()
    })

    expect(screen.getByLabelText('Day:')).toBeInTheDocument()
    expect(screen.getByLabelText('Start Time:')).toBeInTheDocument()
    expect(screen.getByLabelText('End Time:')).toBeInTheDocument()
    expect(screen.getByLabelText('Number of People:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Shift' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should populate areas dropdown', async () => {
    renderWithProviders()

    // Wait for areas to load and check that Kitchen option exists
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Kitchen' })).toBeInTheDocument()
    })

    const areaSelect = screen.getByLabelText('Area:')
    expect(areaSelect).toBeInTheDocument()
    
    // Should have default "Select an area..." option selected
    expect(screen.getByDisplayValue('Select an area...')).toBeInTheDocument()

    // Check that areas are loaded
    const kitchenOption = screen.getByRole('option', { name: 'Kitchen' })
    const diningOption = screen.getByRole('option', { name: 'Dining Room' })
    expect(kitchenOption).toBeInTheDocument()
    expect(diningOption).toBeInTheDocument()
  })

  it('should populate days dropdown', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByLabelText('Day:')).toBeInTheDocument()
    })

    const sundayOption = screen.getByRole('option', { name: 'Sunday' })
    const mondayOption = screen.getByRole('option', { name: 'Monday' })
    const tuesdayOption = screen.getByRole('option', { name: 'Tuesday' })

    expect(sundayOption).toBeInTheDocument()
    expect(mondayOption).toBeInTheDocument()
    expect(tuesdayOption).toBeInTheDocument()
  })

  it('should set default time values', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByDisplayValue('13:00')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('14:00')).toBeInTheDocument()
  })

  it('should use initial values when provided', async () => {
    renderWithProviders({
      initialAreaId: 2,
      initialDayId: 3,
      initialStart: '09:00:00',
      initialEnd: '17:00:00'
    })

    await waitFor(() => {
      expect(screen.getByDisplayValue('09:00')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('17:00')).toBeInTheDocument()
    
    // Check that area 2 and day 3 are selected
    const areaSelect = screen.getByLabelText('Area:') as HTMLSelectElement
    const daySelect = screen.getByLabelText('Day:') as HTMLSelectElement
    
    await waitFor(() => {
      expect(areaSelect.value).toBe('2')
      expect(daySelect.value).toBe('3')
    })
  })

  it('should auto-calculate end time when start time changes', async () => {
    renderWithProviders()
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('13:00')).toBeInTheDocument()
    })

    const startTimeInput = screen.getByLabelText('Start Time:')
    const endTimeInput = screen.getByLabelText('End Time:')
    
    fireEvent.change(startTimeInput, { target: { value: '10:30' } })
    
    // End time should be auto-calculated to one hour later
    expect(endTimeInput).toHaveValue('11:30')
  })

  it('should round times to 15-minute increments', async () => {
    renderWithProviders()
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('13:00')).toBeInTheDocument()
    })

    const startTimeInput = screen.getByLabelText('Start Time:')
    
    // Enter time that should be rounded
    fireEvent.change(startTimeInput, { target: { value: '10:37' } })
    
    // Should be rounded to nearest 15-minute increment (down to 10:30)
    expect(startTimeInput).toHaveValue('10:30')
  })

  it('should set time step to 15 minutes', async () => {
    renderWithProviders()
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('13:00')).toBeInTheDocument()
    })

    const startTimeInput = screen.getByLabelText('Start Time:')
    const endTimeInput = screen.getByLabelText('End Time:')
    
    expect(startTimeInput).toHaveAttribute('step', '900') // 15 minutes in seconds
    expect(endTimeInput).toHaveAttribute('step', '900')
  })

  it('should call onCancel when cancel button is clicked', async () => {
    renderWithProviders()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should submit form with correct data', async () => {
    const { shiftService } = await import('../../../services/shifts')
    vi.mocked(shiftService.createShift).mockResolvedValue({
      id: 1,
      scheduleId: 1,
      areaId: 1,
      dayId: 1,
      startAtSeconds: 32400,
      endAtSeconds: 61200,
      numPeople: 2
    })

    renderWithProviders()
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('13:00')).toBeInTheDocument()
    })

    const user = userEvent.setup()

    // Fill out form
    const areaSelect = screen.getByLabelText('Area:')
    const daySelect = screen.getByLabelText('Day:')
    const startTimeInput = screen.getByLabelText('Start Time:')
    const endTimeInput = screen.getByLabelText('End Time:')
    const numPeopleInput = screen.getByLabelText('Number of People:')

    // Select area and day
    await user.selectOptions(areaSelect, '1') // Kitchen
    await user.selectOptions(daySelect, '1')  // Sunday

    await user.clear(startTimeInput)
    await user.type(startTimeInput, '09:00')
    await user.clear(endTimeInput)
    await user.type(endTimeInput, '17:00')
    await user.clear(numPeopleInput)
    await user.type(numPeopleInput, '2')

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Create Shift' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(shiftService.createShift).toHaveBeenCalledWith({
        areaId: 1, // First area should be selected by default
        dayId: 1,  // First day should be selected by default
        startAtSeconds: 32400, // 09:00:00 in seconds (9 * 3600)
        endAtSeconds: 61200,   // 17:00:00 in seconds (17 * 3600)
        numPeople: 2,
        scheduleId: 1
      })
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('should show error when no schedule is available', () => {
    // Mock no current schedule
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: null,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn()
    })

    renderWithProviders()

    expect(screen.getByText('No schedule selected. Please reload the page.')).toBeInTheDocument()
  })

  it('should disable submit button when no area is selected', async () => {
    renderWithProviders({ initialAreaId: 0 })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create Shift' })).toBeInTheDocument()
    })

    const submitButton = screen.getByRole('button', { name: 'Create Shift' })
    expect(submitButton).toBeDisabled()
  })
})