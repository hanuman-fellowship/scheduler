import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService, type CreateCategoryRequest } from '../../services/categories'

interface Category {
  id: number
  name: string
  color: string
}

interface EditCategoryFormProps {
  category: Category
  onSuccess: () => void
  onCancel: () => void
}

export default function EditCategoryForm({ 
  category, 
  onSuccess, 
  onCancel 
}: EditCategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: category.name,
    color: category.color,
  })

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => 
      categoriesService.updateCategory(category.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
    },
    onError: (error) => {
      console.error('Failed to update category:', error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  const handleChange = (field: keyof CreateCategoryRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={handleChange('name')}
          className="boxy-input w-full"
          required
          placeholder="Enter category name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={formData.color}
            onChange={handleChange('color')}
            className="w-12 h-10 border-2 border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={formData.color}
            onChange={handleChange('color')}
            className="boxy-input flex-1"
            placeholder="#FF0000"
            pattern="^#[0-9A-Fa-f]{6}$"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="boxy-button-secondary"
          disabled={updateMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="boxy-button"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Updating...' : 'Update Category'}
        </button>
      </div>

      {updateMutation.error && (
        <div className="text-red-600 text-sm">
          Error: {updateMutation.error instanceof Error ? updateMutation.error.message : 'Unknown error'}
        </div>
      )}
    </form>
  )
}