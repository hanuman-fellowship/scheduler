import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Schedule {
  id: number
  name: string
  userId: number | null
  template: boolean
  request: number
  createdAt: string
  updatedAt: string
}

interface ScheduleStore {
  currentSchedule: Schedule | null
  isLoading: boolean
  setCurrentSchedule: (schedule: Schedule) => void
  clearCurrentSchedule: () => void
  loadCurrentSchedule: () => Promise<void>
  switchToSchedule: (schedule: Schedule) => Promise<void>
  isEditable: () => boolean
  isViewable: () => boolean
  isPublished: () => boolean
  isRequest: () => boolean
}

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      currentSchedule: null,
      isLoading: false,
      
      setCurrentSchedule: (schedule: Schedule) => {
        set({ currentSchedule: schedule })
      },
      
      clearCurrentSchedule: () => {
        set({ currentSchedule: null })
      },
      
      loadCurrentSchedule: async () => {
        set({ isLoading: true })
        
        try {
          const response = await fetch('/api/schedules/current', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('auth-storage') ? JSON.parse(localStorage.getItem('auth-storage')!).state.token : ''}`
            }
          })
          
          if (response.ok) {
            const schedule = await response.json()
            set({ currentSchedule: schedule, isLoading: false })
          } else {
            console.error('Failed to load current schedule:', response.status)
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Error loading current schedule:', error)
          set({ isLoading: false })
        }
      },
      
      switchToSchedule: async (schedule: Schedule) => {
        set({ isLoading: true })
        
        try {
          // Validate schedule object
          if (!schedule || !schedule.id || !schedule.name) {
            throw new Error('Invalid schedule object provided')
          }
          
          // For now, just update the local state since we don't have the API endpoint yet
          // TODO: Implement actual schedule switching API call
          set({ currentSchedule: schedule, isLoading: false })
          
          // Store the user's schedule preference
          localStorage.setItem('last-selected-schedule-id', schedule.id.toString())
          
          console.log(`Switched to schedule: ${schedule.name} (ID: ${schedule.id})`)
        } catch (error) {
          console.error('Error switching schedule:', error)
          set({ isLoading: false })
          throw error
        }
      },
      
      // Check if current schedule is editable
      // A schedule is editable if user owns it (userId matches) AND user has operations role
      isEditable: () => {
        const schedule = get().currentSchedule
        if (!schedule) return false
        
        // Get user from auth storage directly to avoid circular dependency
        const authStorage = localStorage.getItem('auth-storage')
        if (!authStorage) return false
        
        try {
          const authState = JSON.parse(authStorage)
          const user = authState?.state?.user
          
          if (!user) return false
          
          // Schedule is editable if user owns it AND has operations role
          return schedule.userId === user.id && user.roles.includes('operations')
        } catch (error) {
          console.error('Error checking schedule editable status:', error)
          return false
        }
      },

      // Check if current schedule is viewable (for person/area schedules)
      // Operations can view any schedule, others can view published schedules
      isViewable: () => {
        const schedule = get().currentSchedule
        if (!schedule) return false
        
        // Get user from auth storage directly to avoid circular dependency
        const authStorage = localStorage.getItem('auth-storage')
        if (!authStorage) return false
        
        try {
          const authState = JSON.parse(authStorage)
          const user = authState?.state?.user
          
          if (!user) return false
          
          // Operations role can view any schedule
          if (user.roles.includes('operations')) {
            return true
          }
          
          // Other roles (managers, personnel) can view published schedules
          return schedule.userId === null // Published schedules have userId = null
        } catch (error) {
          console.error('Error checking schedule viewable status:', error)
          return false
        }
      },
      
      // Check if current schedule is published
      isPublished: () => {
        const schedule = get().currentSchedule
        return schedule?.name === 'Published' && schedule?.userId === null
      },
      
      // Check if current schedule is a request
      isRequest: () => {
        const schedule = get().currentSchedule
        return schedule?.request === 2
      }
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the current schedule, not loading state
      partialize: (state) => ({ currentSchedule: state.currentSchedule })
    }
  )
)