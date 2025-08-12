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