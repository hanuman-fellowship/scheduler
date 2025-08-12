import { api } from './api'
import type { ShiftResponse, CreateShiftRequest } from '@shared/types'

export interface Shift extends ShiftResponse {
  scheduleId: number;
  area?: {
    id: number;
    name: string;
    shortName: string;
  };
  day?: {
    id: number;
    name: string;
    dayOfWeek: number;
  };
  assignments?: {
    id: number;
    personId: number;
    name: string | null;
    star: boolean;
  }[];
}

export interface CreateShiftWithScheduleRequest extends CreateShiftRequest {
  scheduleId: number;
}

export interface UpdateShiftRequest extends Partial<CreateShiftRequest> {}

export const shiftService = {
  async getShifts(scheduleId: number, areaId?: number): Promise<Shift[]> {
    const params = new URLSearchParams({ scheduleId: scheduleId.toString() })
    if (areaId) {
      params.append('areaId', areaId.toString())
    }
    const { data } = await api.get<Shift[]>(`/shifts?${params}`)
    return data
  },

  async getShift(id: number): Promise<Shift> {
    const { data } = await api.get<Shift>(`/shifts/${id}`)
    return data
  },

  async createShift(shift: CreateShiftWithScheduleRequest): Promise<Shift> {
    const { data } = await api.post<Shift>('/shifts', shift)
    return data
  },

  async updateShift(id: number, shift: UpdateShiftRequest): Promise<Shift> {
    const { data } = await api.put<Shift>(`/shifts/${id}`, shift)
    return data
  },

  async deleteShift(id: number): Promise<void> {
    await api.delete(`/shifts/${id}`)
  },
}