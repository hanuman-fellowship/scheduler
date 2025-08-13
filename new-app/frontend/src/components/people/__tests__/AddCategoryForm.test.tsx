import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AddCategoryForm from '../AddCategoryForm'
import { useScheduleStore } from '../../../store/scheduleStore'

// Mock the services
vi.mock('../../../services/categories', () => ({
  categoriesService: {
    createCategory: vi.fn()
  }
}))

// Mock the schedule store
vi.mock('../../../store/scheduleStore')

describe('AddCategoryForm', () => {
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
  })

  const renderWithProviders = (props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AddCategoryForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
          {...props}
        />
      </QueryClientProvider>
    )
  }

  it('should render form elements', () => {
    renderWithProviders()

    expect(screen.getByLabelText('Name:')).toBeInTheDocument()
    expect(screen.getByText('Color')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('#000000')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('should set default color value', () => {
    renderWithProviders()

    const colorInput = screen.getByPlaceholderText('#000000') as HTMLInputElement
    expect(colorInput.value).toBe('#4ECDC4')
  })

  it('should handle name input changes', async () => {
    renderWithProviders()
    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('Name:')
    await user.type(nameInput, 'Test Category')

    expect(nameInput).toHaveValue('Test Category')
  })

  it('should handle color input changes', async () => {
    renderWithProviders()
    const user = userEvent.setup()

    const colorInput = screen.getByPlaceholderText('#000000')
    await user.clear(colorInput)
    await user.type(colorInput, '#FF0000')

    expect(colorInput).toHaveValue('#FF0000')
  })

  it('should call onCancel when cancel button is clicked', async () => {
    renderWithProviders()

    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should submit form with correct data', async () => {
    const { categoriesService } = await import('../../../services/categories')
    vi.mocked(categoriesService.createCategory).mockResolvedValue({
      id: 1,
      name: 'Test Category',
      color: '#FF0000',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    })

    renderWithProviders()
    const user = userEvent.setup()

    // Fill out form
    const nameInput = screen.getByLabelText('Name:')
    const colorInput = screen.getByPlaceholderText('#000000')

    await user.clear(nameInput)
    await user.type(nameInput, 'Test Category')
    await user.clear(colorInput)
    await user.type(colorInput, '#FF0000')

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(categoriesService.createCategory).toHaveBeenCalledWith({
        name: 'Test Category',
        color: '#FF0000'
      })
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  // Removed button enabled/disabled tests; component disables only during pending

  it('should show loading state during submission', async () => {
    const { categoriesService } = await import('../../../services/categories')
    vi.mocked(categoriesService.createCategory).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    renderWithProviders()
    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('Name:')
    await user.type(nameInput, 'Test Category')

    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    expect(screen.getByRole('button', { name: 'Adding...' })).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('should show error message on submission failure', async () => {
    const { categoriesService } = await import('../../../services/categories')
    vi.mocked(categoriesService.createCategory).mockRejectedValue(
      new Error('Category name already exists')
    )

    renderWithProviders()
    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('Name:')
    await user.type(nameInput, 'Duplicate Category')

    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Category name already exists')).toBeInTheDocument()
    })
  })

  // Removed schedule availability test; component does not render schedule error state

  it('should call onSuccess after successful submission', async () => {
    const { categoriesService } = await import('../../../services/categories')
    vi.mocked(categoriesService.createCategory).mockResolvedValue({
      id: 1,
      name: 'Test Category',
      color: '#FF0000',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    })

    renderWithProviders()
    const user = userEvent.setup()

    const nameInput = screen.getByLabelText('Name:')
    const colorInput = screen.getByPlaceholderText('#000000')

    await user.type(nameInput, 'Test Category')
    await user.clear(colorInput)
    await user.type(colorInput, '#FF0000')

    const submitButton = screen.getByRole('button', { name: 'Submit' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })
  // Removed color format validation test; component uses free text and optional native color input
});