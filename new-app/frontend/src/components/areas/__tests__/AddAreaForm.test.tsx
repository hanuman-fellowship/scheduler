import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AddAreaForm from '../AddAreaForm'
import { useScheduleStore } from '../../../store/scheduleStore'

// Mock the services
vi.mock('../../../services/areas', () => ({
  areasService: {
    createArea: vi.fn()
  }
}))

// Mock the schedule store
vi.mock('../../../store/scheduleStore')

describe('AddAreaForm', () => {
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

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    mockOnSuccess = vi.fn()
    mockOnCancel = vi.fn()

    // Mock the schedule store
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: mockSchedule,
      loadCurrentSchedule: vi.fn(),
      setCurrentSchedule: vi.fn()
    } as any)
  })

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('should render form fields correctly', () => {
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('Area Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Short Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add Area' })).toBeInTheDocument()
  })

  it('should show placeholder text for inputs', () => {
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByPlaceholderText('e.g. Kitchen, Dining Room, Laundry')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g. K, DR, L (for schedule grid display)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Optional notes or description for this area')).toBeInTheDocument()
  })

  it('should handle form input changes', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const nameInput = screen.getByLabelText('Area Name:')
    const shortNameInput = screen.getByLabelText('Short Name:')
    const notesInput = screen.getByLabelText('Notes:')

    await user.type(nameInput, 'Kitchen')
    await user.type(shortNameInput, 'K')
    await user.type(notesInput, 'Main kitchen area')

    expect(nameInput).toHaveValue('Kitchen')
    expect(shortNameInput).toHaveValue('K')
    expect(notesInput).toHaveValue('Main kitchen area')
  })

  it('should enforce maxLength on shortName', () => {
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const shortNameInput = screen.getByLabelText('Short Name:')
    expect(shortNameInput).toHaveAttribute('maxLength', '5')
  })

  it('should mark required fields as required', () => {
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('Area Name:')).toBeRequired()
    expect(screen.getByLabelText('Short Name:')).toBeRequired()
    expect(screen.getByLabelText('Notes:')).not.toBeRequired()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should submit form with correct data', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockCreateArea = vi.mocked(areasService.createArea)
    mockCreateArea.mockResolvedValue({
      id: 1,
      scheduleId: 1,
      name: 'Kitchen',
      shortName: 'K',
      notes: 'Main kitchen area'
    })

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Area Name:'), 'Kitchen')
    await user.type(screen.getByLabelText('Short Name:'), 'K')
    await user.type(screen.getByLabelText('Notes:'), 'Main kitchen area')

    await user.click(screen.getByRole('button', { name: 'Add Area' }))

    await waitFor(() => {
      expect(mockCreateArea).toHaveBeenCalledWith({
        name: 'Kitchen',
        shortName: 'K',
        notes: 'Main kitchen area',
        scheduleId: 1
      })
    })

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should submit form without notes', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockCreateArea = vi.mocked(areasService.createArea)
    mockCreateArea.mockResolvedValue({
      id: 1,
      scheduleId: 1,
      name: 'Dining Room',
      shortName: 'DR',
      notes: null
    })

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Area Name:'), 'Dining Room')
    await user.type(screen.getByLabelText('Short Name:'), 'DR')
    // Leave notes empty

    await user.click(screen.getByRole('button', { name: 'Add Area' }))

    await waitFor(() => {
      expect(mockCreateArea).toHaveBeenCalledWith({
        name: 'Dining Room',
        shortName: 'DR',
        notes: '',
        scheduleId: 1
      })
    })
  })

  it('should show error when no schedule is available', () => {
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: null,
      loadCurrentSchedule: vi.fn(),
      setCurrentSchedule: vi.fn()
    } as any)

    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByText('No schedule selected. Please reload the page.')).toBeInTheDocument()
  })

  it('should disable submit button and show loading text during submission', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockCreateArea = vi.mocked(areasService.createArea)
    
    // Make the API call hang
    mockCreateArea.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Area Name:'), 'Kitchen')
    await user.type(screen.getByLabelText('Short Name:'), 'K')

    const submitButton = screen.getByRole('button', { name: 'Add Area' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Adding...')
    })
  })

  it('should display error message on API failure', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockCreateArea = vi.mocked(areasService.createArea)
    mockCreateArea.mockRejectedValue(new Error('Network error'))

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <AddAreaForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Area Name:'), 'Kitchen')
    await user.type(screen.getByLabelText('Short Name:'), 'K')
    await user.click(screen.getByRole('button', { name: 'Add Area' }))

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()
  })
})