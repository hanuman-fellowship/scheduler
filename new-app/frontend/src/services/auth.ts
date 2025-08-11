import { api } from './api'
import type { LoginRequest, LoginResponse } from '@shared/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me')
    return data
  },

  async changePassword(oldPassword: string, newPassword: string) {
    const { data } = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    })
    return data
  },
}