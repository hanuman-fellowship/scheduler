import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useScheduleStore } from '../../store/scheduleStore'

interface EditCopyModalProps {
  onSuccess: () => void
  onCancel: () => void
}

interface CopyScheduleRequest {
  sourceId: number
  name: string
}

interface CopyScheduleResponse {
  id: number
  name: string
}

export default function EditCopyModal({ onSuccess, onCancel }: EditCopyModalProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const { currentSchedule, switchToSchedule } = useScheduleStore()
  const queryClient = useQueryClient()

  const copyMutation = useMutation<CopyScheduleResponse, Error, CopyScheduleRequest>({
    mutationFn: async (requestData) => {
      const authStorage = localStorage.getItem('auth-storage')
      const token = authStorage ? JSON.parse(authStorage).state.token : ''
      
      const response = await fetch('/api/schedules/copy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to copy schedule')
      }

      const responseData = await response.json()
      return responseData.schedule
    },
    onSuccess: async (newSchedule) => {
      // Invalidate schedule queries to refresh the list
      await queryClient.invalidateQueries({ queryKey: ['schedules'] })
      
      // Fetch the complete schedule details
      try {
        const authStorage = localStorage.getItem('auth-storage')
        const token = authStorage ? JSON.parse(authStorage).state.token : ''
        
        const response = await fetch(`/api/schedules/${newSchedule.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const fullScheduleData = await response.json()
          // Switch to the new copied schedule with complete data
          await switchToSchedule(fullScheduleData)
        } else {
          console.error('Failed to fetch full schedule details')
          // Fallback: create basic schedule object
          const fallbackSchedule = {
            id: newSchedule.id,
            name: newSchedule.name,
            userId: null,
            template: false,
            request: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          await switchToSchedule(fallbackSchedule)
        }
      } catch (error) {
        console.error('Error fetching schedule details:', error)
      }
      
      onSuccess()
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Schedule name is required')
      return
    }

    if (!currentSchedule) {
      setError('No current schedule to copy')
      return
    }

    setError('')
    copyMutation.mutate({
      sourceId: currentSchedule.id,
      name: name.trim()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Creating an editable copy of: <strong>{currentSchedule?.name}</strong>
      </div>
      <div className="text-xs text-gray-500 mb-4">
        This creates a personal copy you can edit. The original schedule remains unchanged.
      </div>

      <div>
        <label htmlFor="scheduleName" className="block text-sm font-medium text-gray-700 mb-1">
          New Schedule Name
        </label>
        <input
          id="scheduleName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name for the copied schedule..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
          disabled={copyMutation.isPending}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={copyMutation.isPending}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={copyMutation.isPending || !name.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copyMutation.isPending ? 'Creating Copy...' : 'Create Copy'}
        </button>
      </div>
    </form>
  )
}