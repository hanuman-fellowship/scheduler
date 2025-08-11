import { api } from './api'
import type { SchedulesResponse } from '@shared/types'

export const schedulesService = {
  async getSchedules(): Promise<SchedulesResponse> {
    const { data } = await api.get<SchedulesResponse>('/schedules')
    return data
  },

  async getSchedule(id: number) {
    const { data } = await api.get(`/schedules/${id}`)
    return data
  },

  async copySchedule(sourceId: number, name: string) {
    const { data } = await api.post('/schedules/copy', { sourceId, name })
    return data
  },
}