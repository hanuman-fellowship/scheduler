import { api } from './api';
import type { AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse } from '@shared/types';

export const scheduleViewService = {
  async getAreaSchedule(areaId: number): Promise<AreaScheduleResponse> {
    const response = await api.get(`/areas/${areaId}/schedule`);
    return response.data;
  },

  async getPersonSchedule(personId: number): Promise<PersonScheduleResponse> {
    const response = await api.get(`/people/${personId}/schedule`);
    return response.data;
  },

  async getGapsSchedule(): Promise<GapsScheduleResponse> {
    const response = await api.get('/schedule/gaps');
    return response.data;
  }
};