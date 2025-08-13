import { useQuery } from '@tanstack/react-query';
import { areasService } from '../services/areas';

export const useAreas = () => {
  const {
    data: areas = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['areas'],
    queryFn: () => areasService.getAreas(),
  });

  return {
    areas,
    isLoading,
    error,
  };
};