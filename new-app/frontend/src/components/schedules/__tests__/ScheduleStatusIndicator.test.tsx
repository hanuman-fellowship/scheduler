import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ScheduleStatusIndicator } from '../ScheduleStatusIndicator'
import { useScheduleStore } from '../../../store/scheduleStore'
import { useAuthStore } from '../../../store/authStore'

// Mock the stores
vi.mock('../../../store/scheduleStore')
vi.mock('../../../store/authStore')

const mockUseScheduleStore = vi.mocked(useScheduleStore)
const mockUseAuthStore = vi.mocked(useAuthStore)

const mockSchedule = {
  id: 1,
  name: 'Test Schedule',
  userId: 1,
  template: false,
  request: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z'
}

const mockPublishedSchedule = {
  id: 2,
  name: 'Published',
  userId: null,
  template: false,
  request: 0,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z'
}

const mockRequestSchedule = {
  id: 3,
  name: 'Test Request',
  userId: 1,
  template: false,
  request: 2,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T12:00:00Z'
}

describe('ScheduleStatusIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default auth store mock
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, username: 'test', email: 'test@example.com', roles: ['operations'] },
      token: 'mock-token',
      setAuth: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
      isOperations: vi.fn(() => true),
      isManager: vi.fn(() => false),
      isPersonnel: vi.fn(() => false)
    })
  })

  it('should show "No schedule selected" when no current schedule', () => {
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: null,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText('No schedule selected')).toBeInTheDocument()
  })

  it('should show "Editing" status for editable schedule', () => {
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => true),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText(/✏️ Editing: Test Schedule/)).toBeInTheDocument()
    expect(screen.getByText('🔓 Editable')).toBeInTheDocument()
  })

  it('should show "Published" status for published schedule', () => {
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockPublishedSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isPublished: vi.fn(() => true),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText(/📅 Published on/)).toBeInTheDocument()
    expect(screen.getByText('🔒 Read Only')).toBeInTheDocument()
  })

  it('should show "Request" status for request schedule', () => {
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockRequestSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => true)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText(/📝 Request: Test Request/)).toBeInTheDocument()
  })

  it('should show "Viewing" status for other user schedule', () => {
    const otherUserSchedule = { ...mockSchedule, userId: 2 }
    
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: otherUserSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => false),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText(/👀 Viewing: Test Schedule/)).toBeInTheDocument()
    expect(screen.getByText('👁️ View Only')).toBeInTheDocument()
  })

  it('should not show action buttons for non-operations users', () => {
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, username: 'test', email: 'test@example.com', roles: ['manager'] },
      token: 'mock-token',
      setAuth: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
      isOperations: vi.fn(() => false),
      isManager: vi.fn(() => true),
      isPersonnel: vi.fn(() => false)
    })

    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => true),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText(/✏️ Editing: Test Schedule/)).toBeInTheDocument()
    expect(screen.queryByText('🔓 Editable')).not.toBeInTheDocument()
  })

  it('should display schedule ID', () => {
    mockUseScheduleStore.mockReturnValue({
      currentSchedule: mockSchedule,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: vi.fn(),
      switchToSchedule: vi.fn(),
      isEditable: vi.fn(() => true),
      isPublished: vi.fn(() => false),
      isRequest: vi.fn(() => false)
    })

    render(<ScheduleStatusIndicator />)
    
    expect(screen.getByText('Schedule ID: 1')).toBeInTheDocument()
  })
})