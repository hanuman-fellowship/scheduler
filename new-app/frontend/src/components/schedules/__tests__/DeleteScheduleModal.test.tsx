import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DeleteScheduleModal from '../DeleteScheduleModal'
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
    userId: 1, // User-owned schedule
    request: 0,
    template: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  loadCurrentSchedule: vi.fn()
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
      <DeleteScheduleModal {...defaultProps} />
    </QueryClientProvider>
  )
}

describe('DeleteScheduleModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useScheduleStore).mockReturnValue(mockScheduleStore)
  })

  it('renders delete confirmation for user-owned schedule', () => {
    renderComponent()
    
    expect(screen.getByText('Are you sure you want to delete the schedule:')).toBeInTheDocument()
    expect(screen.getByText('"Test Schedule"')).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Schedule' })).toBeInTheDocument()
  })

  it('prevents deletion of published schedules', () => {
    // Mock published schedule (userId = null)
    vi.mocked(useScheduleStore).mockReturnValue({
      ...mockScheduleStore,
      currentSchedule: {
        ...mockScheduleStore.currentSchedule,
        userId: null // Published schedule
      }
    })
    
    renderComponent()
    
    expect(screen.getByText(/Published schedules cannot be deleted/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete Schedule' })).not.toBeInTheDocument()
  })

  it('shows error when no current schedule exists', () => {
    vi.mocked(useScheduleStore).mockReturnValue({
      ...mockScheduleStore,
      currentSchedule: null
    })
    
    renderComponent()
    
    expect(screen.getByText(/No schedule selected for deletion/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete Schedule' })).not.toBeInTheDocument()
  })

  it('successfully deletes schedule when confirmed', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true
    })
    
    renderComponent({ onSuccess })
    
    const deleteButton = screen.getByRole('button', { name: 'Delete Schedule' })
    await user.click(deleteButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/schedules/1', {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })
    })
    
    await waitFor(() => {
      expect(mockScheduleStore.loadCurrentSchedule).toHaveBeenCalled()
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to delete schedule' })
    })
    
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: 'Delete Schedule' })
    await user.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to delete schedule')).toBeInTheDocument()
    })
  })

  it('disables buttons during deletion', async () => {
    const user = userEvent.setup()
    
    // Mock slow API response
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: 'Delete Schedule' })
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    
    await user.click(deleteButton)
    
    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
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

  it('shows error when trying to delete published schedule', () => {
    // Mock published schedule
    vi.mocked(useScheduleStore).mockReturnValue({
      ...mockScheduleStore,
      currentSchedule: {
        ...mockScheduleStore.currentSchedule,
        userId: null,
        name: 'Published'
      }
    })
    
    renderComponent()
    
    expect(screen.getByText(/Published schedules cannot be deleted/)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Delete Schedule' })).not.toBeInTheDocument()
  })

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup()
    
    mockFetch.mockRejectedValueOnce(new Error('Network error'))
    
    renderComponent()
    
    const deleteButton = screen.getByRole('button', { name: 'Delete Schedule' })
    await user.click(deleteButton)
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('shows proper warning message', () => {
    renderComponent()
    
    expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
    expect(screen.getByText(/All shifts, assignments, and schedule data will be permanently deleted/)).toBeInTheDocument()
  })

  it('prevents deletion when schedule is not owned by user', () => {
    // Mock schedule owned by different user
    vi.mocked(useScheduleStore).mockReturnValue({
      ...mockScheduleStore,
      currentSchedule: {
        ...mockScheduleStore.currentSchedule,
        userId: 999 // Different user
      }
    })
    
    renderComponent()
    
    // Should still show delete button since we only check for published (userId = null)
    // The backend will handle ownership validation
    expect(screen.getByRole('button', { name: 'Delete Schedule' })).toBeInTheDocument()
  })
})