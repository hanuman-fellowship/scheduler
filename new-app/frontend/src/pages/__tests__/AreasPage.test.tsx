import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useLocation } from 'react-router-dom'
import AreasPage from '../AreasPage'
import { useScheduleStore } from '../../store/scheduleStore'
import { createTestWrapper } from '../../__tests__/utils/testWrappers'

// Mock the services
vi.mock('../../services/areas', () => ({
  areasService: {
    getAreas: vi.fn(),
    deleteArea: vi.fn()
  }
}))

// Mock the schedule store
vi.mock('../../store/scheduleStore')

// Mock the global modal context
vi.mock('../../contexts/GlobalModalContext', async () => {
  const actual = await vi.importActual('../../contexts/GlobalModalContext')
  return {
    ...actual,
    useGlobalModal: vi.fn(() => ({
      openModal: vi.fn(),
      closeModal: vi.fn()
    }))
  }
})

// Mock react-router-dom with useLocation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useLocation: vi.fn()
  }
})

// Mock child components to isolate AreasPage testing
vi.mock('../../components/areas/AddAreaForm', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="add-area-form">
      <h2>Mock Add Area Form</h2>
      <button onClick={() => onSuccess()}>Submit</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  )
}))

vi.mock('../../components/areas/EditAreaForm', () => ({
  default: ({ area, onSuccess, onCancel }: any) => (
    <div data-testid="edit-area-form">
      <span>Editing {area.name}</span>
      <button onClick={() => onSuccess()}>Update</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  )
}))

describe('AreasPage', () => {
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
    {
      id: 1,
      scheduleId: 1,
      name: 'Kitchen',
      shortName: 'K',
      notes: 'Main kitchen area'
    },
    {
      id: 2,
      scheduleId: 1,
      name: 'Dining Room',
      shortName: 'DR',
      notes: null
    }
  ]

  beforeEach(() => {
    // Mock the schedule store
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: mockSchedule,
      loadCurrentSchedule: vi.fn(),
      setCurrentSchedule: vi.fn()
    } as any)

    // Reset location mock to default state  
    vi.mocked(useLocation).mockReturnValue({
      state: null,
      pathname: '/areas',
      search: '',
      hash: '',
      key: 'test'
    })
  })

  const renderWithProviders = (component: React.ReactElement) => {
    const TestWrapper = createTestWrapper()
    return render(component, { wrapper: TestWrapper })
  }

  it('should render page title and new area button', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    renderWithProviders(<AreasPage />)

    // Wait for the areas to load before checking
    await waitFor(() => {
      expect(screen.getByText('Areas Management')).toBeInTheDocument()
    })
    
    expect(screen.getByRole('button', { name: 'New Area...' })).toBeInTheDocument()
  })

  it('should display loading state', async () => {
    const { areasService } = await import('../../services/areas')
    // Make the API call hang to simulate loading
    vi.mocked(areasService.getAreas).mockImplementation(() => new Promise(() => {}))

    renderWithProviders(<AreasPage />)

    expect(screen.getByText('Loading areas...')).toBeInTheDocument()
  })

  it('should display areas list', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
      expect(screen.getByText('Short name: K')).toBeInTheDocument()
      expect(screen.getByText('Notes: Main kitchen area')).toBeInTheDocument()
      
      expect(screen.getByText('Dining Room')).toBeInTheDocument()
      expect(screen.getByText('Short name: DR')).toBeInTheDocument()
    })
  })

  it('should display empty state when no areas exist', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue([])

    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('No areas yet. Create one to get started.')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Create First Area' })).toBeInTheDocument()
    })
  })

  it('should call openModal when New Area button is clicked', async () => {
    const { areasService } = await import('../../services/areas')
    const { useGlobalModal } = await import('../../contexts/GlobalModalContext')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    const mockOpenModal = vi.fn()
    vi.mocked(useGlobalModal).mockReturnValue({
      openModal: mockOpenModal,
      closeModal: vi.fn()
    })

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'New Area...' }))

    expect(mockOpenModal).toHaveBeenCalledWith('area')
  })

  it('should call openModal from empty state button', async () => {
    const { areasService } = await import('../../services/areas')
    const { useGlobalModal } = await import('../../contexts/GlobalModalContext')
    vi.mocked(areasService.getAreas).mockResolvedValue([])

    const mockOpenModal = vi.fn()
    vi.mocked(useGlobalModal).mockReturnValue({
      openModal: mockOpenModal,
      closeModal: vi.fn()
    })

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('No areas yet. Create one to get started.')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Create First Area' }))

    expect(mockOpenModal).toHaveBeenCalledWith('area')
  })

  it('should show edit and delete buttons for each area', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      // Should have 2 Edit buttons and 2 Delete buttons (one for each area)
      const editButtons = screen.getAllByText('Edit')
      const deleteButtons = screen.getAllByText('Delete')
      
      expect(editButtons).toHaveLength(2)
      expect(deleteButtons).toHaveLength(2)
    })
  })

  it('should open edit modal when Edit button is clicked', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0]) // Click first Edit button (Kitchen)

    expect(screen.getByText('Edit Area')).toBeInTheDocument()
    expect(screen.getByTestId('edit-area-form')).toBeInTheDocument()
    expect(screen.getByText('Editing Kitchen')).toBeInTheDocument()
  })

  it('should open delete confirmation modal when Delete button is clicked', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0]) // Click first Delete button (Kitchen)

    expect(screen.getByText('Confirm Delete Area')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to delete the area "Kitchen"?')).toBeInTheDocument()
    expect(screen.getByText('Warning: This will also delete all shifts and assignments in this area.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete Area' })).toBeInTheDocument()
  })

  it('should handle area deletion', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)
    vi.mocked(areasService.deleteArea).mockResolvedValue()

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Open delete confirmation
    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    // Confirm deletion
    await user.click(screen.getByRole('button', { name: 'Delete Area' }))

    await waitFor(() => {
      expect(areasService.deleteArea).toHaveBeenCalledWith(1)
    })
  })

  it('should cancel deletion when Cancel is clicked', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Open delete confirmation
    const deleteButtons = screen.getAllByText('Delete')
    await user.click(deleteButtons[0])

    expect(screen.getByText('Confirm Delete Area')).toBeInTheDocument()

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByText('Confirm Delete Area')).not.toBeInTheDocument()
    })
  })

  it('should close edit modal when form actions are triggered', async () => {
    const { areasService } = await import('../../services/areas')
    vi.mocked(areasService.getAreas).mockResolvedValue(mockAreas)

    const user = userEvent.setup()
    renderWithProviders(<AreasPage />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Open edit modal (this is still local to the page)
    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await user.click(editButtons[0])
    
    expect(screen.getByTestId('edit-area-form')).toBeInTheDocument()

    // Simulate form success
    await user.click(screen.getByRole('button', { name: 'Update' }))
    
    await waitFor(() => {
      expect(screen.queryByTestId('edit-area-form')).not.toBeInTheDocument()
    })
  })

  it('should show loading state when no schedule is available', () => {
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: null,
      loadCurrentSchedule: vi.fn(),
      setCurrentSchedule: vi.fn()
    } as any)

    renderWithProviders(<AreasPage />)

    expect(screen.getByText('Loading schedule context...')).toBeInTheDocument()
  })

})