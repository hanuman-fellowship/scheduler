import { api } from './api';

export interface Area {
  id: number;
  scheduleId: number;
  name: string;
  shortName: string;
  notes?: string;
}

export interface CreateAreaInput {
  name: string;
  shortName: string;
  notes?: string;
  scheduleId: number;
}

export interface UpdateAreaInput {
  name?: string;
  shortName?: string;
  notes?: string;
}

export const areasService = {
  // Get all areas in current schedule context
  getAreas: async (scheduleId?: number): Promise<Area[]> => {
    const params = scheduleId ? `?scheduleId=${scheduleId}` : '';
    const { data } = await api.get(`/areas${params}`);
    return data;
  },

  getArea: async (id: number): Promise<Area> => {
    const { data } = await api.get(`/areas/${id}`);
    return data;
  },

  createArea: async (areaData: CreateAreaInput): Promise<Area> => {
    const { data } = await api.post('/areas', areaData);
    return data;
  },

  updateArea: async (id: number, areaData: UpdateAreaInput): Promise<Area> => {
    const { data } = await api.put(`/areas/${id}`, areaData);
    return data;
  },

  deleteArea: async (id: number): Promise<void> => {
    await api.delete(`/areas/${id}`);
  },

  clearAreaShifts: async (id: number): Promise<void> => {
    // This would typically be a separate endpoint, but for now we'll handle it in delete
    // In the future we might add: await api.post(`/areas/${id}/clear`);
  },
};