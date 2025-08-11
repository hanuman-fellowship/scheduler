import { useMutation } from '@tanstack/react-query'
import { authService } from '../services/auth'
import { useAuthStore } from '../store/authStore'
import type { LoginRequest } from '@shared/types'

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.token, data.user)
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((state) => state.logout)
  return logout
}