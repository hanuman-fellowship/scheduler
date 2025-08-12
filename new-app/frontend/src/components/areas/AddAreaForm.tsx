import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { areasService, type CreateAreaInput } from '../../services/areas'
import { useScheduleStore } from '../../store/scheduleStore'

interface AddAreaFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddAreaForm({ onSuccess, onCancel }: AddAreaFormProps) {
  const { currentSchedule } = useScheduleStore()
  const [formData, setFormData] = useState<CreateAreaInput>({
    name: '',
    shortName: '',
    notes: '',
    scheduleId: currentSchedule?.id || 1, // Default to schedule ID 1 if not loaded
  })

  const queryClient = useQueryClient()

  const createAreaMutation = useMutation({
    mutationFn: areasService.createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAreaMutation.mutate(formData)
  }

  const handleInputChange = (field: keyof CreateAreaInput, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Ensure we have a current schedule
  if (!currentSchedule) {
    return (
      <div className="p-4 text-center text-red-600">
        No schedule selected. Please reload the page.
      </div>
    )
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

      {createAreaMutation.error && (
        <div className="text-red-600 text-sm">
          {createAreaMutation.error instanceof Error 
            ? createAreaMutation.error.message 
            : 'Failed to create area'}
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
          disabled={createAreaMutation.isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createAreaMutation.isPending ? 'Adding...' : 'Add Area'}
        </button>
      </div>
    </form>
  )
}