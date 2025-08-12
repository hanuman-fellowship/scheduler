import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { areasService, type Area, type UpdateAreaInput } from '../../services/areas'

interface EditAreaFormProps {
  area: Area
  onSuccess: () => void
  onCancel: () => void
}

export default function EditAreaForm({ area, onSuccess, onCancel }: EditAreaFormProps) {
  const [formData, setFormData] = useState<UpdateAreaInput>({
    name: area.name,
    shortName: area.shortName,
    notes: area.notes || '',
  })

  const queryClient = useQueryClient()

  const updateAreaMutation = useMutation({
    mutationFn: (data: UpdateAreaInput) => areasService.updateArea(area.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateAreaMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof UpdateAreaInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Area Name:
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. Kitchen, Dining Room, Laundry"
          required
        />
      </div>

      <div>
        <label htmlFor="shortName" className="block text-sm font-medium">
          Short Name:
        </label>
        <input
          id="shortName"
          type="text"
          value={formData.shortName}
          onChange={(e) => handleInputChange('shortName', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="e.g. K, DR, L (for schedule grid display)"
          maxLength={5}
          required
        />
        <div className="text-xs text-gray-600 mt-1">
          Short abbreviation used in schedule displays (max 5 characters)
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium">
          Notes:
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Optional notes or description for this area"
          rows={3}
        />
        <div className="text-xs text-gray-600 mt-1">Optional</div>
      </div>

      {updateAreaMutation.error && (
        <div className="text-red-600 text-sm">
          {updateAreaMutation.error instanceof Error 
            ? updateAreaMutation.error.message 
            : 'Failed to update area'}
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
          disabled={updateAreaMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {updateAreaMutation.isPending ? 'Updating...' : 'Update Area'}
        </button>
      </div>
    </form>
  )
}