import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { shiftService, type UpdateShiftRequest, type Shift } from '../../services/shifts'
import { areasService } from '../../services/areas'
import { daysService } from '../../services/days'
import { useScheduleStore } from '../../store/scheduleStore'
import { assignmentService } from '../../services/assignmentService'
import { AssignmentModal } from '../assignments/AssignmentModal'
import { AssignmentListModal } from '../assignments/AssignmentListModal'
import type { AssignmentResponse } from '@shared/types'

// Time conversion utilities (inline for now)
const timeStringToSeconds = (timeString: string): number => {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
  return hours * 3600 + minutes * 60 + seconds;
};

const secondsToDisplayTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const toHtmlTimeInput = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

interface EditShiftFormProps {
  shiftId: number
  onSuccess: () => void
  onCancel: () => void
  onDelete?: () => void
}

export default function EditShiftForm({ 
  shiftId,
  onSuccess, 
  onCancel,
  onDelete
}: EditShiftFormProps) {
  const { currentSchedule } = useScheduleStore()
  const queryClient = useQueryClient()
  
  // Assignment modal states
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showAssignmentListModal, setShowAssignmentListModal] = useState(false)

  // Load existing shift data
  const { data: shift, isLoading: shiftLoading, error: shiftError } = useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => shiftService.getShift(shiftId),
    enabled: !!shiftId
  })
  
  // Load current assignments for this shift
  const { data: assignments = [] } = useQuery({
    queryKey: ['assignments', shiftId],
    queryFn: () => assignmentService.getShiftAssignments(shiftId),
    enabled: !!shiftId
  })

  // Form state initialized with shift data
  const [formData, setFormData] = useState({
    areaId: 0,
    dayId: 1,
    start: '13:00',
    end: '14:00',
    numPeople: 1,
  })

  // Update form data when shift loads
  useEffect(() => {
    if (shift) {
      setFormData({
        areaId: shift.areaId,
        dayId: shift.dayId,
        start: toHtmlTimeInput(shift.startAtSeconds),
        end: toHtmlTimeInput(shift.endAtSeconds),
        numPeople: shift.numPeople,
      })
    }
  }, [shift])

  // Load areas and days for dropdowns
  const { data: areas = [] } = useQuery({
    queryKey: ['areas', currentSchedule?.id],
    queryFn: () => areasService.getAreas(currentSchedule?.id),
    enabled: !!currentSchedule?.id,
  })

  const { data: days = [] } = useQuery({
    queryKey: ['days', currentSchedule?.id],
    queryFn: () => daysService.getDays(currentSchedule?.id || 1),
    enabled: !!currentSchedule?.id,
  })

  const updateShiftMutation = useMutation({
    mutationFn: (data: UpdateShiftRequest) => shiftService.updateShift(shiftId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] })
      queryClient.invalidateQueries({ queryKey: ['shift', shiftId] })
      onSuccess()
    },
  })

  const deleteShiftMutation = useMutation({
    mutationFn: () => shiftService.deleteShift(shiftId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] })
      onDelete ? onDelete() : onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.areaId || formData.areaId === 0) {
      return
    }

    // Validate time range
    const startSeconds = timeStringToSeconds(formData.start + ':00')
    const endSeconds = timeStringToSeconds(formData.end + ':00')
    
    if (endSeconds <= startSeconds) {
      return // TODO: Show error message
    }

    // Check if we're reducing num_people below current assignments
    const currentAssignments = shift?.assignments?.length || 0
    if (formData.numPeople < currentAssignments) {
      return // TODO: Show error message about too many people assigned
    }

    // Convert time strings to seconds
    const shiftData: UpdateShiftRequest = {
      areaId: formData.areaId,
      dayId: formData.dayId,
      startAtSeconds: startSeconds,
      endAtSeconds: endSeconds,
      numPeople: formData.numPeople,
    }
    
    updateShiftMutation.mutate(shiftData)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this shift? This will remove all assignments.')) {
      deleteShiftMutation.mutate()
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Auto-calculate end time when start time changes
  const handleStartTimeChange = (startTime: string) => {
    setFormData(prev => {
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHours = hours + 1
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      return {
        ...prev,
        start: startTime,
        end: endTime,
      }
    })
  }

  // Round time to nearest 15-minute increment
  const roundToNearest15Minutes = (timeString: string): string => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes
    const rounded = Math.round(totalMinutes / 15) * 15
    const roundedHours = Math.floor(rounded / 60)
    const roundedMinutes = rounded % 60
    return `${roundedHours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`
  }

  const handleEndTimeChange = (endTime: string) => {
    setFormData(prev => ({
      ...prev,
      end: endTime,
    }))
  }

  // Handle loading and error states
  if (shiftLoading) {
    return (
      <div className="p-4 text-center">
        Loading shift details...
      </div>
    )
  }

  if (shiftError || !shift) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load shift details. Please try again.
      </div>
    )
  }

  // Ensure we have a current schedule
  if (!currentSchedule) {
    return (
      <div className="p-4 text-center text-red-600">
        No schedule selected. Please reload the page.
      </div>
    )
  }

  // Get current assignment count for validation
  const currentAssignments = shift.assignments?.length || 0

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="area" className="block text-sm font-medium">
          Area:
        </label>
        <select
          id="area"
          value={formData.areaId || ''}
          onChange={(e) => handleInputChange('areaId', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          <option value="">Select an area...</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="day" className="block text-sm font-medium">
          Day:
        </label>
        <select
          id="day"
          value={formData.dayId}
          onChange={(e) => handleInputChange('dayId', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        >
          {days.map((day) => (
            <option key={day.id} value={day.id}>
              {day.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start" className="block text-sm font-medium">
            Start Time:
          </label>
          <input
            id="start"
            type="time"
            step="900" // 15 minutes in seconds
            value={formData.start}
            onChange={(e) => handleStartTimeChange(roundToNearest15Minutes(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="end" className="block text-sm font-medium">
            End Time:
          </label>
          <input
            id="end"
            type="time"
            step="900" // 15 minutes in seconds
            value={formData.end}
            onChange={(e) => handleEndTimeChange(roundToNearest15Minutes(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="numPeople" className="block text-sm font-medium">
          Number of People:
        </label>
        <input
          id="numPeople"
          type="number"
          min={Math.max(1, currentAssignments)}
          value={formData.numPeople}
          onChange={(e) => handleInputChange('numPeople', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
        {currentAssignments > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            Currently assigned: {currentAssignments} people (minimum)
          </p>
        )}
      </div>

      {/* Assignments Section */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">
            Assignments ({assignments.length}/{formData.numPeople})
          </label>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setShowAssignmentListModal(true)}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              View All
            </button>
            <button
              type="button"
              onClick={() => setShowAssignModal(true)}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Person
            </button>
          </div>
        </div>
        
        {/* Display current assignments inline */}
        {assignments.length > 0 ? (
          <div className="space-y-1">
            {assignments.slice(0, 3).map((assignment: AssignmentResponse) => (
              <div key={assignment.id} className="flex items-center justify-between text-sm">
                <span style={{ color: assignment.person?.category?.color || '#000' }}>
                  {assignment.star && '⭐ '}
                  {assignment.person?.name || assignment.person?.displayName || assignment.name || 'Unassigned'}
                </span>
              </div>
            ))}
            {assignments.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAssignmentListModal(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                +{assignments.length - 3} more...
              </button>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No assignments yet</p>
        )}
      </div>

      {(updateShiftMutation.error || deleteShiftMutation.error) && (
        <div className="text-red-600 text-sm">
          {updateShiftMutation.error instanceof Error 
            ? updateShiftMutation.error.message 
            : deleteShiftMutation.error instanceof Error
            ? deleteShiftMutation.error.message
            : 'Failed to update shift'}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteShiftMutation.isPending}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {deleteShiftMutation.isPending ? 'Deleting...' : 'Delete Shift'}
        </button>

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateShiftMutation.isPending || !formData.areaId || formData.areaId === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updateShiftMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
    
    {/* Assignment Modals */}
    {shift && (
      <>
        <AssignmentModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false)
            queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] })
          }}
          shiftId={shiftId}
          shiftName={`${areas.find(a => a.id === shift.areaId)?.name || 'Area'} - ${days.find(d => d.id === shift.dayId)?.name || 'Day'} ${secondsToDisplayTime(shift.startAtSeconds)}`}
        />
        
        <AssignmentListModal
          isOpen={showAssignmentListModal}
          onClose={() => {
            setShowAssignmentListModal(false)
            queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] })
          }}
          shiftId={shiftId}
          shiftName={`${areas.find(a => a.id === shift.areaId)?.name || 'Area'} - ${days.find(d => d.id === shift.dayId)?.name || 'Day'} ${secondsToDisplayTime(shift.startAtSeconds)}`}
          onAddAssignment={() => {
            setShowAssignmentListModal(false)
            setShowAssignModal(true)
          }}
        />
      </>
    )}
  </>
  )
}