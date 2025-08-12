import { useQuery } from '@tanstack/react-query';
import { scheduleViewService } from '../services/scheduleView';
import type { ScheduleViewMode } from '@shared/types';

export const useScheduleView = (viewMode: ScheduleViewMode) => {
  return useQuery({
    queryKey: ['scheduleView', viewMode.type, viewMode.id],
    queryFn: async () => {
      switch (viewMode.type) {
        case 'area':
          return scheduleViewService.getAreaSchedule(viewMode.id as number);
        case 'person':
          return scheduleViewService.getPersonSchedule(viewMode.id as number);
        case 'gaps':
          return scheduleViewService.getGapsSchedule();
        default:
          throw new Error(`Invalid schedule view type: ${viewMode.type}`);
      }
    },
    enabled: viewMode.id !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};