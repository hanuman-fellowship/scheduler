import { api } from './api'

export interface Person {
  id: number
  first: string
  last: string
  displayName: string
  category?: {
    id: number
    name: string
    color: string
  }
}

export interface CreatePersonRequest {
  first: string
  last: string
  displayName?: string
  residentCategoryId: number
  scheduleId: number
}

export interface UpdatePersonRequest extends Partial<CreatePersonRequest> {}

export const peopleService = {
  async getPeople(): Promise<Person[]> {
    const { data } = await api.get<Person[]>('/people')
    return data
  },

  async getPerson(id: number): Promise<Person> {
    const { data } = await api.get<Person>(`/people/${id}`)
    return data
  },

  async createPerson(person: CreatePersonRequest): Promise<Person> {
    const { data } = await api.post<Person>('/people', person)
    return data
  },

  async updatePerson(id: number, person: UpdatePersonRequest): Promise<Person> {
    const { data } = await api.put<Person>(`/people/${id}`, person)
    return data
  },

  async deletePerson(id: number): Promise<void> {
    await api.delete(`/people/${id}`)
  },

  // Legacy endpoint for big board - we'll keep this for now
  async getBigBoard() {
    const { data } = await api.get('/people/board')
    return data
  },
}