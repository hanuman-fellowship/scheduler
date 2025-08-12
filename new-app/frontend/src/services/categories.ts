import { api } from './api'

export interface Category {
  id: number
  name: string
  color: string
}

export interface CreateCategoryRequest {
  name: string
  color: string
}

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    const { data } = await api.get('/categories')
    return data
  },

  async createCategory(category: CreateCategoryRequest): Promise<Category> {
    const { data } = await api.post('/categories', category)
    return data
  },

  async updateCategory(id: number, category: Partial<CreateCategoryRequest>): Promise<Category> {
    const { data } = await api.put(`/categories/${id}`, category)
    return data
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}