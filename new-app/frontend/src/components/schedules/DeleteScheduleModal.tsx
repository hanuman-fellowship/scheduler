import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useScheduleStore } from '../../store/scheduleStore'

interface DeleteScheduleModalProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function DeleteScheduleModal({ onSuccess, onCancel }: DeleteScheduleModalProps) {
  const [error, setError] = useState('')
  const { currentSchedule, loadCurrentSchedule } = useScheduleStore()
  const queryClient = useQueryClient()

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: async (scheduleId) => {
      const authStorage = localStorage.getItem('auth-storage')
      const token = authStorage ? JSON.parse(authStorage).state.token : ''
      
      const response = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete schedule')
      }
    },
    onSuccess: async () => {
      // Invalidate schedule queries
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })
      
      // Load the default current schedule since we deleted the current one
      await loadCurrentSchedule()
      
      onSuccess()
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const handleConfirmDelete = () => {
    if (!currentSchedule) {
      setError('No current schedule to delete')
      return
    }

    // Only allow deleting schedules owned by the user
    if (currentSchedule.userId === null) {
      setError('Cannot delete published schedules')
      return
    }

    setError('')
    deleteMutation.mutate(currentSchedule.id)
  }

  const canDelete = currentSchedule && currentSchedule.userId !== null

  return (
    <div className="space-y-4">
      <div className="text-sm">
        {canDelete ? (
          <>
            <p className="mb-2">Are you sure you want to delete the schedule:</p>
            <p className="font-semibold text-gray-900 mb-2">"{currentSchedule.name}"</p>
            <p className="text-red-600 text-xs bg-red-50 p-2 rounded">
              ⚠️ This action cannot be undone. All shifts, assignments, and schedule data will be permanently deleted.
            </p>
          </>
        ) : (
          <div className="text-red-600 bg-red-50 p-3 rounded">
            {currentSchedule?.userId === null 
              ? "Published schedules cannot be deleted. You can only delete your own draft schedules."
              : "No schedule selected for deletion."
            }
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        {canDelete && (
          <button
            type="button"
            onClick={handleConfirmDelete}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Schedule'}
          </button>
        )}
      </div>
    </div>
  )
}