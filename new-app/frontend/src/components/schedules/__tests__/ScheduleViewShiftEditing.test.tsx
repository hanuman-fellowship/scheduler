import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, useParams } from 'react-router-dom'
import { GlobalModalProvider } from '../../../contexts/GlobalModalContext'
import { ScheduleView } from '../ScheduleView'
import { useScheduleStore } from '../../../store/scheduleStore'
import { useScheduleView } from '../../../hooks/useScheduleView'

// Mock the stores and hooks
vi.mock('../../../store/scheduleStore')
vi.mock('../../../hooks/useScheduleView')

// Mock React Router params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(() => ({ type: 'area', id: '1' })),
    useSearchParams: () => [new URLSearchParams()]
  }
})

const mockUseScheduleStore = vi.mocked(useScheduleStore)
const mockUseScheduleView = vi.mocked(useScheduleView)

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
        numPeople: 2,
        assignments: [
          { id: 1, personId: 1, name: 'John Doe', star: false }
        ]
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
        <GlobalModalProvider>
          {component}
        </GlobalModalProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('ScheduleView Shift Editing', () => {
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

    mockUseScheduleView.mockReturnValue({
      data: mockAreaScheduleData,
      isLoading: false,
      error: null
    })
  })

  it('should make shift times clickable when schedule is editable', async () => {
    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Find the shift time display
    const shiftTime = screen.getByText('8:00 - 9:00')
    expect(shiftTime).toBeInTheDocument()
    
    // Check that it has click handler styles
    expect(shiftTime).toHaveStyle({ cursor: 'pointer' })
  })

  it('should open edit modal when shift time is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Kitchen')).toBeInTheDocument()
    })

    // Click on the shift time
    const shiftTime = screen.getByText('8:00 - 9:00')
    await user.click(shiftTime)

    // Should open the edit shift modal
    await waitFor(() => {
      expect(screen.getByText('Edit Shift')).toBeInTheDocument()
    })
  })

  it('should not make shift times clickable when schedule is not editable', async () => {
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

    // Find the shift time display
    const shiftTime = screen.getByText('8:00 - 9:00')
    expect(shiftTime).toBeInTheDocument()
    
    // Check that it does not have click handler styles
    expect(shiftTime).toHaveStyle({ cursor: 'default' })
  })

  it('should handle clicks on person schedule shift times', async () => {
    const user = userEvent.setup()
    
    // Mock person schedule data
    const personScheduleData = {
      person: {
        id: 1,
        name: 'John Doe',
        category: { name: 'Residents', color: '#008080' },
        assignments: [
          {
            id: 1,
            personId: 1,
            shiftId: 1,
            star: false,
            shift: {
              id: 1,
              dayId: 1,
              startAtSeconds: 28800, // 8:00 AM
              endAtSeconds: 32400, // 9:00 AM
              numPeople: 2,
              area: { id: 1, name: 'Kitchen', shortName: 'K' },
              assignments: []
            }
          }
        ]
      },
      bounds: mockAreaScheduleData.bounds,
      totalHours: { 1: 1, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 },
      notes: { operations: [], personnel: [] },
      editable: true
    }

    // Update mocks for person schedule
    vi.mocked(useParams).mockReturnValue({ type: 'person', id: '1' })
    mockUseScheduleView.mockReturnValue({
      data: personScheduleData,
      isLoading: false,
      error: null
    })

    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })

    // Click on the shift time in person schedule
    const shiftTime = screen.getByText('8:00 - 9:00')
    await user.click(shiftTime)

    // Should open the edit shift modal
    await waitFor(() => {
      expect(screen.getByText('Edit Shift')).toBeInTheDocument()
    })
  })

  it('should handle gaps schedule shift editing', async () => {
    const user = userEvent.setup()
    
    // Mock gaps schedule data
    const gapsScheduleData = {
      unassignedShifts: [
        {
          id: 1,
          dayId: 1,
          startAtSeconds: 28800, // 8:00 AM
          endAtSeconds: 32400, // 9:00 AM
          numPeople: 2,
          area: { id: 1, name: 'Kitchen', shortName: 'K' },
          assignments: []
        }
      ],
      bounds: mockAreaScheduleData.bounds,
      editable: false
    }

    // Update mocks for gaps schedule
    vi.mocked(useParams).mockReturnValue({ type: 'gaps', id: 'gaps' })
    mockUseScheduleView.mockReturnValue({
      data: gapsScheduleData,
      isLoading: false,
      error: null
    })

    renderWithProviders(<ScheduleView />)

    await waitFor(() => {
      expect(screen.getByText('Unassigned Shifts')).toBeInTheDocument()
    })

    // Even though gaps schedule is not editable by default,
    // operations users should still be able to edit shifts
    // But in this test, the schedule permission overrides individual shift editability
    const shiftTime = screen.getByText('8:00 - 9:00')
    expect(shiftTime).toHaveStyle({ cursor: 'default' })
  })
})