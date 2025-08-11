import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

export function useBigBoard() {
  return useQuery({
    queryKey: ['bigBoard'],
    queryFn: async () => {
      const { data } = await api.get('/people/board')
      return data
    },
  })
}