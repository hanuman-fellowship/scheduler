import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import EditAreaForm from '../EditAreaForm'

// Mock the services
vi.mock('../../../services/areas', () => ({
  areasService: {
    updateArea: vi.fn()
  }
}))

describe('EditAreaForm', () => {
  let queryClient: QueryClient
  let mockOnSuccess: ReturnType<typeof vi.fn>
  let mockOnCancel: ReturnType<typeof vi.fn>

  const mockArea = {
    id: 1,
    scheduleId: 1,
    name: 'Kitchen',
    shortName: 'K',
    notes: 'Original notes'
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
  })

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    )
  }

  it('should pre-populate form fields with area data', () => {
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByDisplayValue('Kitchen')).toBeInTheDocument()
    expect(screen.getByDisplayValue('K')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Original notes')).toBeInTheDocument()
  })

  it('should handle area with null notes', () => {
    const areaWithoutNotes = { ...mockArea, notes: undefined }
    
    renderWithQueryClient(
      <EditAreaForm area={areaWithoutNotes} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const notesField = screen.getByLabelText('Notes:')
    expect(notesField).toHaveValue('')
  })

  it('should render form fields correctly', () => {
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('Area Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Short Name:')).toBeInTheDocument()
    expect(screen.getByLabelText('Notes:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Area' })).toBeInTheDocument()
  })

  it('should handle form input changes', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const nameInput = screen.getByLabelText('Area Name:')
    const shortNameInput = screen.getByLabelText('Short Name:')
    const notesInput = screen.getByLabelText('Notes:')

    await user.clear(nameInput)
    await user.type(nameInput, 'Main Kitchen')
    
    await user.clear(shortNameInput)
    await user.type(shortNameInput, 'MK')
    
    await user.clear(notesInput)
    await user.type(notesInput, 'Updated notes')

    expect(nameInput).toHaveValue('Main Kitchen')
    expect(shortNameInput).toHaveValue('MK')
    expect(notesInput).toHaveValue('Updated notes')
  })

  it('should enforce maxLength on shortName', () => {
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const shortNameInput = screen.getByLabelText('Short Name:')
    expect(shortNameInput).toHaveAttribute('maxLength', '5')
  })

  it('should mark required fields as required', () => {
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('Area Name:')).toBeRequired()
    expect(screen.getByLabelText('Short Name:')).toBeRequired()
    expect(screen.getByLabelText('Notes:')).not.toBeRequired()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('should submit form with correct data', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockUpdateArea = vi.mocked(areasService.updateArea)
    mockUpdateArea.mockResolvedValue({
      id: 1,
      scheduleId: 1,
      name: 'Main Kitchen',
      shortName: 'MK',
      notes: 'Updated notes'
    })

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const nameInput = screen.getByLabelText('Area Name:')
    const shortNameInput = screen.getByLabelText('Short Name:')
    const notesInput = screen.getByLabelText('Notes:')

    await user.clear(nameInput)
    await user.type(nameInput, 'Main Kitchen')
    
    await user.clear(shortNameInput)
    await user.type(shortNameInput, 'MK')
    
    await user.clear(notesInput)
    await user.type(notesInput, 'Updated notes')

    await user.click(screen.getByRole('button', { name: 'Update Area' }))

    await waitFor(() => {
      expect(mockUpdateArea).toHaveBeenCalledWith(1, {
        name: 'Main Kitchen',
        shortName: 'MK',
        notes: 'Updated notes'
      })
    })

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should submit form with partial changes', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockUpdateArea = vi.mocked(areasService.updateArea)
    mockUpdateArea.mockResolvedValue({
      id: 1,
      scheduleId: 1,
      name: 'Main Kitchen',
      shortName: 'K',
      notes: 'Original notes'
    })

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    // Only change the name
    const nameInput = screen.getByLabelText('Area Name:')
    await user.clear(nameInput)
    await user.type(nameInput, 'Main Kitchen')

    await user.click(screen.getByRole('button', { name: 'Update Area' }))

    await waitFor(() => {
      expect(mockUpdateArea).toHaveBeenCalledWith(1, {
        name: 'Main Kitchen',
        shortName: 'K', // Original value
        notes: 'Original notes' // Original value
      })
    })
  })

  it('should disable submit button and show loading text during submission', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockUpdateArea = vi.mocked(areasService.updateArea)
    
    // Make the API call hang
    mockUpdateArea.mockImplementation(() => new Promise(() => {}))

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    const submitButton = screen.getByRole('button', { name: 'Update Area' })
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(submitButton).toHaveTextContent('Updating...')
    })
  })

  it('should display error message on API failure', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockUpdateArea = vi.mocked(areasService.updateArea)
    mockUpdateArea.mockRejectedValue(new Error('Update failed'))

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    await user.click(screen.getByRole('button', { name: 'Update Area' }))

    await waitFor(() => {
      expect(screen.getByText('Update failed')).toBeInTheDocument()
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()
  })

  it('should handle empty string notes correctly', async () => {
    const { areasService } = await import('../../../services/areas')
    const mockUpdateArea = vi.mocked(areasService.updateArea)
    mockUpdateArea.mockResolvedValue(mockArea)

    const user = userEvent.setup()
    
    renderWithQueryClient(
      <EditAreaForm area={mockArea} onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
    )

    // Clear notes field
    const notesInput = screen.getByLabelText('Notes:')
    await user.clear(notesInput)

    await user.click(screen.getByRole('button', { name: 'Update Area' }))

    await waitFor(() => {
      expect(mockUpdateArea).toHaveBeenCalledWith(1, {
        name: 'Kitchen',
        shortName: 'K',
        notes: ''
      })
    })
  })
})