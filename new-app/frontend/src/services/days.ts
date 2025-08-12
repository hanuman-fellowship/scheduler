import { api } from './api'
import type { DayResponse } from '@shared/types'

export interface Day extends DayResponse {}

export const daysService = {
  async getDays(scheduleId: number): Promise<Day[]> {
    const { data } = await api.get<Day[]>(`/days?scheduleId=${scheduleId}`)
    return data
  },

  async getDay(id: number): Promise<Day> {
    const { data } = await api.get<Day>(`/days/${id}`)
    return data
  },
}