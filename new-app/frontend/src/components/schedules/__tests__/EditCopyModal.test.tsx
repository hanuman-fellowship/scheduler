import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import EditCopyModal from '../EditCopyModal'
import { useScheduleStore } from '../../../store/scheduleStore'

// Mock the schedule store
vi.mock('../../../store/scheduleStore')

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => JSON.stringify({ state: { token: 'test-token' } })),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

const mockScheduleStore = {
  currentSchedule: {
    id: 1,
    name: 'Test Schedule',
    userId: 1,
    request: 0,
    template: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  switchToSchedule: vi.fn()
}

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })
  
  const defaultProps = {
    onSuccess: vi.fn(),
    onCancel: vi.fn(),
    ...props
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <EditCopyModal {...defaultProps} />
    </QueryClientProvider>
  )
}

describe('EditCopyModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useScheduleStore).mockReturnValue(mockScheduleStore)
  })

  it('renders modal with current schedule name', () => {
    renderComponent()
    
    expect(screen.getByText('Creating an editable copy of:')).toBeInTheDocument()
    expect(screen.getByText('Test Schedule')).toBeInTheDocument()
    expect(screen.getByLabelText('New Schedule Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter name for the copied schedule...')).toBeInTheDocument()
  })

  it('disables submit button when name is empty', () => {
    renderComponent()
    
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when name is provided', async () => {
    const user = userEvent.setup()
    renderComponent()
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    
    expect(submitButton).toBeDisabled()
    
    await user.type(nameInput, 'Test Name')
    
    expect(submitButton).toBeEnabled()
  })

  it('successfully creates copy when form is submitted with valid data', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    // Mock successful API response
    const mockResponse = {
      id: 2,
      name: 'Test Schedule Copy',
      userId: 1,
      request: 0,
      template: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })
    
    renderComponent({ onSuccess })
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    
    await user.type(nameInput, 'Test Schedule Copy')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/schedules/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          sourceId: 1,
          name: 'Test Schedule Copy'
        })
      })
    })
    
    await waitFor(() => {
      expect(mockScheduleStore.switchToSchedule).toHaveBeenCalledWith(mockResponse)
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to copy schedule' })
    })
    
    renderComponent()
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    
    await user.type(nameInput, 'Test Schedule Copy')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to copy schedule')).toBeInTheDocument()
    })
  })

  it('shows error when no current schedule is available', async () => {
    const user = userEvent.setup()
    
    // Mock store with no current schedule
    vi.mocked(useScheduleStore).mockReturnValue({
      ...mockScheduleStore,
      currentSchedule: null
    })
    
    renderComponent()
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    
    await user.type(nameInput, 'Test Schedule Copy')
    await user.click(submitButton)
    
    expect(screen.getByText('No current schedule to copy')).toBeInTheDocument()
  })

  it('disables form during submission', async () => {
    const user = userEvent.setup()
    
    // Mock slow API response
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    
    renderComponent()
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    
    await user.type(nameInput, 'Test Schedule Copy')
    await user.click(submitButton)
    
    expect(screen.getByRole('button', { name: 'Creating Copy...' })).toBeDisabled()
    expect(nameInput).toBeDisabled()
    expect(cancelButton).toBeDisabled()
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    
    renderComponent({ onCancel })
    
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)
    
    expect(onCancel).toHaveBeenCalled()
  })

  it('trims whitespace from schedule name', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 2,
        name: 'Trimmed Name',
        userId: 1,
        request: 0,
        template: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      })
    })
    
    renderComponent()
    
    const nameInput = screen.getByLabelText('New Schedule Name')
    const submitButton = screen.getByRole('button', { name: 'Create Copy' })
    
    await user.type(nameInput, '  Trimmed Name  ')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/schedules/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify({
          sourceId: 1,
          name: 'Trimmed Name'
        })
      })
    })
  })
})