import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '../../services/categories'
import { peopleService } from '../../services/people'

interface AddPersonFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface CreatePersonRequest {
  first: string
  last: string
  display_name?: string
  resident_category_id: number
}

export default function AddPersonForm({ onSuccess, onCancel }: AddPersonFormProps) {
  const [formData, setFormData] = useState<CreatePersonRequest>({
    first: '',
    last: '',
    display_name: '',
    resident_category_id: 0,
  })

  const queryClient = useQueryClient()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  })

  const createPersonMutation = useMutation({
    mutationFn: peopleService.createPerson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createPersonMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof CreatePersonRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="first" className="block text-sm font-medium">
          First:
        </label>
        <input
          id="first"
          type="text"
          value={formData.first}
          onChange={(e) => handleInputChange('first', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="last" className="block text-sm font-medium">
          Last:
        </label>
        <input
          id="last"
          type="text"
          value={formData.last}
          onChange={(e) => handleInputChange('last', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="display_name" className="block text-sm font-medium">
          Display Name:
        </label>
        <input
          id="display_name"
          type="text"
          value={formData.display_name}
          onChange={(e) => handleInputChange('display_name', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <i className="text-xs text-gray-600">(leave blank to auto-generate)</i>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium">
          Resident Category:
        </label>
        <select
          id="category"
          value={formData.resident_category_id}
          onChange={(e) => handleInputChange('resident_category_id', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value={0}>Select a category...</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {createPersonMutation.error && (
        <div className="text-red-600 text-sm">
          {createPersonMutation.error instanceof Error 
            ? createPersonMutation.error.message 
            : 'Failed to create person'}
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
          disabled={createPersonMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createPersonMutation.isPending ? 'Adding...' : 'Submit'}
        </button>
      </div>
    </form>
  )
}