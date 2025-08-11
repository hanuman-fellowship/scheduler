import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserRole } from '@shared/types'

interface AuthUser {
  id: number
  username: string
  email: string
  roles: UserRole[]
}

interface AuthStore {
  token: string | null
  user: AuthUser | null
  setAuth: (token: string, user: AuthUser) => void
  logout: () => void
  hasRole: (role: UserRole) => boolean
  isOperations: () => boolean
  isManager: () => boolean
  isPersonnel: () => boolean
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      
      setAuth: (token: string, user: AuthUser) => {
        set({ token, user })
      },
      
      logout: () => {
        set({ token: null, user: null })
      },
      
      hasRole: (role: UserRole) => {
        const user = get().user
        return user?.roles.includes(role) ?? false
      },
      
      isOperations: () => get().hasRole('operations'),
      isManager: () => get().hasRole('manager'),
      isPersonnel: () => get().hasRole('personnel'),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)