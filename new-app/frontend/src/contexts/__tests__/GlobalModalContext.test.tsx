import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { GlobalModalProvider, useGlobalModal } from '../GlobalModalContext'
import { useScheduleStore } from '../../store/scheduleStore'

// Mock all the dependencies
vi.mock('../../store/scheduleStore')
vi.mock('../../components/shifts/AddShiftForm', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="add-shift-form">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

vi.mock('../../components/schedules/EditCopyModal', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="edit-copy-modal">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

vi.mock('../../components/schedules/DeleteScheduleModal', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="delete-schedule-modal">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

// Mock all other modal components to keep tests focused
vi.mock('../../components/shifts/EditShiftForm', () => ({ default: () => <div data-testid="edit-shift-form" /> }))
vi.mock('../../components/people/AddPersonForm', () => ({ default: () => <div data-testid="add-person-form" /> }))
vi.mock('../../components/people/AddCategoryForm', () => ({ default: () => <div data-testid="add-category-form" /> }))
vi.mock('../../components/areas/AddAreaForm', () => ({ default: () => <div data-testid="add-area-form" /> }))
vi.mock('../../components/schedules/AreaSelectionContent', () => ({ AreaSelectionContent: () => <div data-testid="area-selection" /> }))
vi.mock('../../components/schedules/PersonSelectionContent', () => ({ PersonSelectionContent: () => <div data-testid="person-selection" /> }))
vi.mock('../../components/categories/EditCategoryForm', () => ({ default: () => <div data-testid="edit-category-form" /> }))
vi.mock('../../components/categories/DeleteCategoryModal', () => ({ default: () => <div data-testid="delete-category-modal" /> }))
vi.mock('../../components/schedules/InProgressScheduleSelection', () => ({ InProgressScheduleSelection: () => <div data-testid="in-progress-schedules" /> }))
vi.mock('../../components/schedules/PublishedScheduleSelection', () => ({ PublishedScheduleSelection: () => <div data-testid="published-schedules" /> }))
vi.mock('../../components/assignments/AssignmentModal', () => ({ AssignmentModal: () => <div data-testid="assignment-modal" /> }))

// Test component that uses the modal context
function TestComponent() {
  const {
    openModal,
    openAreaSelectionModal,
    openPersonSelectionModal,
    openEditCategoryModal,
    openDeleteCategoryModal,
    openInProgressSchedulesModal,
    openPublishedSchedulesModal,
    openAssignmentModal,
    openEditCopyModal,
    openDeleteScheduleModal,
    closeModal
  } = useGlobalModal()

  return (
    <div>
      <button onClick={() => openModal('shift')}>Open Shift Modal</button>
      <button onClick={() => openModal('editShift', { shiftId: 1 })}>Open Edit Shift Modal</button>
      <button onClick={() => openModal('person')}>Open Person Modal</button>
      <button onClick={() => openModal('category')}>Open Category Modal</button>
      <button onClick={() => openModal('area')}>Open Area Modal</button>
      <button onClick={openAreaSelectionModal}>Open Area Selection</button>
      <button onClick={openPersonSelectionModal}>Open Person Selection</button>
      <button onClick={() => openEditCategoryModal({ id: 1, name: 'Test', color: '#FF0000' })}>Open Edit Category</button>
      <button onClick={() => openDeleteCategoryModal({ id: 1, name: 'Test', color: '#FF0000' })}>Open Delete Category</button>
      <button onClick={openInProgressSchedulesModal}>Open In Progress Schedules</button>
      <button onClick={openPublishedSchedulesModal}>Open Published Schedules</button>
      <button onClick={() => openAssignmentModal(1, 'Test Shift')}>Open Assignment Modal</button>
      <button onClick={openEditCopyModal}>Open Edit Copy Modal</button>
      <button onClick={openDeleteScheduleModal}>Open Delete Schedule Modal</button>
      <button onClick={closeModal}>Close Modal</button>
    </div>
  )
}

const renderWithProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } }
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <GlobalModalProvider>
        <TestComponent />
      </GlobalModalProvider>
    </QueryClientProvider>
  )
}

describe('GlobalModalContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: null,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isViewable: vi.fn(() => false),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })
  })

  it('opens and closes edit copy modal', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    // Open modal
    const openButton = screen.getByText('Open Edit Copy Modal')
    await user.click(openButton)

    expect(screen.getByText('Edit a Copy')).toBeInTheDocument()
    expect(screen.getByTestId('edit-copy-modal')).toBeInTheDocument()

    // Close modal via success callback
    const successButton = screen.getByText('Success')
    await user.click(successButton)

    expect(screen.queryByText('Edit a Copy')).not.toBeInTheDocument()
  })

  it('opens and closes delete schedule modal', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    // Open modal
    const openButton = screen.getByText('Open Delete Schedule Modal')
    await user.click(openButton)

    expect(screen.getByText('Delete Schedule')).toBeInTheDocument()
    expect(screen.getByTestId('delete-schedule-modal')).toBeInTheDocument()

    // Close modal via cancel callback
    const cancelButton = screen.getByText('Cancel')
    await user.click(cancelButton)

    expect(screen.queryByText('Delete Schedule')).not.toBeInTheDocument()
  })

  it('opens shift modal with context data', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const openButton = screen.getByText('Open Shift Modal')
    await user.click(openButton)

    expect(screen.getByText('New Shift')).toBeInTheDocument()
    expect(screen.getByTestId('add-shift-form')).toBeInTheDocument()
  })

  it('opens edit shift modal with shift data', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const openButton = screen.getByText('Open Edit Shift Modal')
    await user.click(openButton)

    expect(screen.getByText('Edit Shift')).toBeInTheDocument()
    expect(screen.getByTestId('edit-shift-form')).toBeInTheDocument()
  })

  it('opens area selection modal', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const openButton = screen.getByText('Open Area Selection')
    await user.click(openButton)

    expect(screen.getByText('View Area Schedule')).toBeInTheDocument()
    expect(screen.getByTestId('area-selection')).toBeInTheDocument()
  })

  it('opens person selection modal', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const openButton = screen.getByText('Open Person Selection')
    await user.click(openButton)

    expect(screen.getByText('View Person Schedule')).toBeInTheDocument()
    expect(screen.getByTestId('person-selection')).toBeInTheDocument()
  })

  it('opens assignment modal with shift data', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    const openButton = screen.getByText('Open Assignment Modal')
    await user.click(openButton)

    expect(screen.getByTestId('assignment-modal')).toBeInTheDocument()
  })

  it('closes any modal when closeModal is called', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    // Open a modal first
    const openButton = screen.getByText('Open Edit Copy Modal')
    await user.click(openButton)
    expect(screen.getByText('Edit a Copy')).toBeInTheDocument()

    // Close it
    const closeButton = screen.getByText('Close Modal')
    await user.click(closeButton)
    expect(screen.queryByText('Edit a Copy')).not.toBeInTheDocument()
  })

  it('handles multiple modal types correctly', async () => {
    const user = userEvent.setup()
    renderWithProvider()

    // Open edit copy modal
    await user.click(screen.getByText('Open Edit Copy Modal'))
    expect(screen.getByText('Edit a Copy')).toBeInTheDocument()

    // Switch to delete modal (should replace, not stack)
    await user.click(screen.getByText('Open Delete Schedule Modal'))
    expect(screen.queryByText('Edit a Copy')).not.toBeInTheDocument()
    expect(screen.getByText('Delete Schedule')).toBeInTheDocument()
  })

  it('throws error when used outside provider', () => {
    // Temporarily suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useGlobalModal must be used within a GlobalModalProvider')

    consoleSpy.mockRestore()
  })
})