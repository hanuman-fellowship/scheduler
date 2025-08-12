import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScheduleStore } from '../scheduleStore'

// Mock fetch globally
global.fetch = vi.fn()

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('Schedule Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useScheduleStore.getState().clearCurrentSchedule()
    
    // Reset all mocks
    vi.clearAllMocks()
    
    // Mock localStorage to return auth token
    mockLocalStorage.getItem.mockImplementation((key: string) => {
      if (key === 'auth-storage') {
        return JSON.stringify({
          state: { token: 'test-token' }
        })
      }
      return null
    })
  })

  describe('initial state', () => {
    it('should have null current schedule initially', () => {
      const { currentSchedule, isLoading } = useScheduleStore.getState()
      expect(currentSchedule).toBeNull()
      expect(isLoading).toBe(false)
    })
  })

  describe('setCurrentSchedule', () => {
    it('should set the current schedule', () => {
      const schedule = {
        id: 1,
        name: 'Published',
        userId: null,
        template: false,
        request: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      useScheduleStore.getState().setCurrentSchedule(schedule)
      
      const { currentSchedule } = useScheduleStore.getState()
      expect(currentSchedule).toEqual(schedule)
    })
  })

  describe('clearCurrentSchedule', () => {
    it('should clear the current schedule', () => {
      const schedule = {
        id: 1,
        name: 'Published',
        userId: null,
        template: false,
        request: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      // Set a schedule first
      useScheduleStore.getState().setCurrentSchedule(schedule)
      expect(useScheduleStore.getState().currentSchedule).toEqual(schedule)

      // Clear it
      useScheduleStore.getState().clearCurrentSchedule()
      expect(useScheduleStore.getState().currentSchedule).toBeNull()
    })
  })

  describe('loadCurrentSchedule', () => {
    it('should load current schedule from API successfully', async () => {
      const mockSchedule = {
        id: 1,
        name: 'Published',
        userId: null,
        template: false,
        request: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      // Mock successful fetch
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSchedule,
      } as Response)

      await useScheduleStore.getState().loadCurrentSchedule()

      const { currentSchedule, isLoading } = useScheduleStore.getState()
      
      expect(currentSchedule).toEqual(mockSchedule)
      expect(isLoading).toBe(false)
      
      // Verify API was called correctly
      expect(mockFetch).toHaveBeenCalledWith('/api/schedules/current', {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      })
    })

    it('should handle API error gracefully', async () => {
      // Mock failed fetch
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response)

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await useScheduleStore.getState().loadCurrentSchedule()

      const { currentSchedule, isLoading } = useScheduleStore.getState()
      
      expect(currentSchedule).toBeNull()
      expect(isLoading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load current schedule:', 404)
      
      consoleSpy.mockRestore()
    })

    it('should handle network error gracefully', async () => {
      // Mock network error
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await useScheduleStore.getState().loadCurrentSchedule()

      const { currentSchedule, isLoading } = useScheduleStore.getState()
      
      expect(currentSchedule).toBeNull()
      expect(isLoading).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Error loading current schedule:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should set loading state during API call', async () => {
      // Mock a delayed fetch
      const mockFetch = vi.mocked(fetch)
      let resolvePromise: (value: any) => void
      const fetchPromise = new Promise((resolve) => {
        resolvePromise = resolve
      })
      mockFetch.mockReturnValueOnce(fetchPromise as Promise<Response>)

      // Start loading
      const loadPromise = useScheduleStore.getState().loadCurrentSchedule()
      
      // Should be loading
      expect(useScheduleStore.getState().isLoading).toBe(true)
      
      // Resolve the fetch
      resolvePromise!({
        ok: true,
        json: async () => ({ id: 1, name: 'Test' }),
      } as Response)
      
      await loadPromise
      
      // Should not be loading anymore
      expect(useScheduleStore.getState().isLoading).toBe(false)
    })

    it('should handle missing auth token', async () => {
      // Mock localStorage to return no auth token
      mockLocalStorage.getItem.mockReturnValue(null)

      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'Test' }),
      } as Response)

      await useScheduleStore.getState().loadCurrentSchedule()

      // Should still call API but with empty token
      expect(mockFetch).toHaveBeenCalledWith('/api/schedules/current', {
        headers: {
          'Authorization': 'Bearer '
        }
      })
    })
  })
})