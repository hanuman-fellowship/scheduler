import { api } from './api'
import type { SchedulesResponse } from '@shared/types'

export interface Schedule {
  id: number
  name: string
  userId?: number | null
  template: boolean
  request: number
  createdAt: string
  updatedAt?: string
}

export const schedulesService = {
  async getSchedules(): Promise<SchedulesResponse> {
    const { data } = await api.get<SchedulesResponse>('/schedules')
    return data
  },

  async getPublishedSchedules(): Promise<Schedule[]> {
    const { data } = await api.get<Schedule[]>('/schedules/published-list')
    return data
  },

  async getSchedule(id: number) {
    const { data } = await api.get(`/schedules/${id}`)
    return data
  },

  async getCurrentSchedule(): Promise<Schedule> {
    const { data } = await api.get('/schedules/current')
    return data
  },

  async copySchedule(sourceId: number, name: string) {
    const { data } = await api.post('/schedules/copy', { sourceId, name })
    return data
  },

  async publishSchedule(scheduleId: number, startDate: string, endDate: string): Promise<Schedule> {
    const { data } = await api.post('/schedules/publish', {
      scheduleId,
      startDate,
      endDate
    })
    return data
  },

  async deleteSchedule(id: number): Promise<void> {
    await api.delete(`/schedules/${id}`)
  }
}