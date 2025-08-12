import axios from 'axios'
import { useAuthStore } from '../store/authStore'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('API Request:', config.method?.toUpperCase(), config.url, 'with token:', token.substring(0, 20) + '...')
  } else {
    console.warn('API Request without token:', config.method?.toUpperCase(), config.url)
  }
  return config
})

// Response interceptor to handle auth errors and retry logic
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.method?.toUpperCase(), response.config.url)
    return response
  },
  async (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    })

    // Handle authentication errors
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)