import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import App from '../App'
import { useScheduleStore } from '../store/scheduleStore'
import { useAuthStore } from '../store/authStore'

// Mock the stores
vi.mock('../store/scheduleStore')
vi.mock('../store/authStore')

// Mock the child components to avoid router setup complexity
vi.mock('../components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>
}))

vi.mock('../pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}))

vi.mock('../pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}))

vi.mock('../pages/SchedulePage', () => ({
  default: () => <div data-testid="schedule-page">Schedule Page</div>
}))

vi.mock('../pages/BigBoardPage', () => ({
  default: () => <div data-testid="big-board-page">Big Board Page</div>
}))

vi.mock('../pages/PeoplePage', () => ({
  default: () => <div data-testid="people-page">People Page</div>
}))

describe('App Component', () => {
  const mockLoadCurrentSchedule = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useScheduleStore
    vi.mocked(useScheduleStore).mockReturnValue({
      currentSchedule: null,
      isLoading: false,
      setCurrentSchedule: vi.fn(),
      clearCurrentSchedule: vi.fn(),
      loadCurrentSchedule: mockLoadCurrentSchedule,
    })
  })

  describe('authentication flow', () => {
    it('should show login page when user is not authenticated', () => {
      // Mock no token
      vi.mocked(useAuthStore).mockReturnValue({
        token: null,
      } as any)

      const { getByTestId } = render(<App />)
      
      expect(getByTestId('login-page')).toBeInTheDocument()
      expect(mockLoadCurrentSchedule).not.toHaveBeenCalled()
    })

    it('should show main app when user is authenticated', () => {
      // Mock with token
      vi.mocked(useAuthStore).mockReturnValue({
        token: 'test-token',
      } as any)

      const { getByTestId } = render(<App />)
      
      expect(getByTestId('layout')).toBeInTheDocument()
    })
  })

  describe('schedule context loading', () => {
    it('should load current schedule when user authenticates', async () => {
      // Mock with token
      vi.mocked(useAuthStore).mockReturnValue({
        token: 'test-token',
      } as any)

      render(<App />)
      
      await waitFor(() => {
        expect(mockLoadCurrentSchedule).toHaveBeenCalledTimes(1)
      })
    })

    it('should not load schedule when user is not authenticated', () => {
      // Mock no token
      vi.mocked(useAuthStore).mockReturnValue({
        token: null,
      } as any)

      render(<App />)
      
      expect(mockLoadCurrentSchedule).not.toHaveBeenCalled()
    })

    it('should reload schedule when authentication state changes', async () => {
      let authState = { token: null }
      
      // Mock dynamic auth state
      vi.mocked(useAuthStore).mockImplementation(() => authState as any)

      const { rerender } = render(<App />)
      
      // Initially no token, no load
      expect(mockLoadCurrentSchedule).not.toHaveBeenCalled()
      
      // User logs in
      authState = { token: 'test-token' }
      rerender(<App />)
      
      await waitFor(() => {
        expect(mockLoadCurrentSchedule).toHaveBeenCalledTimes(1)
      })
      
      // User logs out
      authState = { token: null }
      rerender(<App />)
      
      // Should not call again (still 1 time total)
      expect(mockLoadCurrentSchedule).toHaveBeenCalledTimes(1)
      
      // User logs in again
      authState = { token: 'new-token' }
      rerender(<App />)
      
      await waitFor(() => {
        expect(mockLoadCurrentSchedule).toHaveBeenCalledTimes(2)
      })
    })
  })
})