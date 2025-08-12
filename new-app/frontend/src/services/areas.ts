import { api } from './api';
import type { Area } from '@shared/types';

export const areasService = {
  // Get all areas in current schedule context
  getAreas: async (): Promise<Area[]> => {
    const { data } = await api.get('/areas');
    return data;
  },
};