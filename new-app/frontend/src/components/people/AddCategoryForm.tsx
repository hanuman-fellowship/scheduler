import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService, type CreateCategoryRequest } from '../../services/categories'
import ColorPicker from '../ui/ColorPicker'

interface AddCategoryFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddCategoryForm({ onSuccess, onCancel }: AddCategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryRequest>({
    name: '',
    color: '#4ECDC4',
  })

  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: categoriesService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCategoryMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof CreateCategoryRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name:
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <ColorPicker
          value={formData.color}
          onChange={(color) => handleInputChange('color', color)}
          id="color"
        />
      </div>

      {createCategoryMutation.error && (
        <div className="text-red-600 text-sm">
          {createCategoryMutation.error instanceof Error 
            ? createCategoryMutation.error.message 
            : 'Failed to create category'}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={createCategoryMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createCategoryMutation.isPending ? 'Adding...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}