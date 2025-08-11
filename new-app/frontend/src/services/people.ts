import { api } from './api'

export const peopleService = {
  async getBigBoard() {
    const { data } = await api.get('/people/board')
    return data
  },

  async getPerson(id: number) {
    const { data } = await api.get(`/people/${id}`)
    return data
  },

  async getPersonSchedule(id: number) {
    const { data } = await api.get(`/people/${id}/schedule`)
    return data
  },
}