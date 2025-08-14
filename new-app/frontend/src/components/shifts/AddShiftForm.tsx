import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { shiftService } from '../../services/shifts'
import { areasService } from '../../services/areas'
import { daysService } from '../../services/days'
import { useScheduleStore } from '../../store/scheduleStore'
// Time conversion utility (inline for now)
const timeStringToSeconds = (timeString: string): number => {
  const parts = timeString.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
  return hours * 3600 + minutes * 60 + seconds;
};

interface AddShiftFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialAreaId?: number
  initialDayId?: number
  initialStart?: string
  initialEnd?: string
}

export default function AddShiftForm({ 
  onSuccess, 
  onCancel, 
  initialAreaId,
  initialDayId,
  initialStart = '13:00:00',
  initialEnd = '14:00:00'
}: AddShiftFormProps) {
  const { currentSchedule } = useScheduleStore()
  
  // Early return if no schedule available
  if (!currentSchedule) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-semibold text-red-800 mb-2">No Schedule Available</h3>
        <p className="text-red-600">Please select a schedule before creating shifts.</p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }
  
  // Use a separate form state for time strings (for UI display)
  const [formData, setFormData] = useState({
    areaId: initialAreaId || 0,
    dayId: initialDayId || 0, // Will be set when days load
    start: initialStart,
    end: initialEnd,
    numPeople: 1,
    scheduleId: currentSchedule.id,
  })

  const queryClient = useQueryClient()

  // Load areas and days for dropdowns
  const { data: areas = [] } = useQuery({
    queryKey: ['areas', currentSchedule.id],
    queryFn: () => areasService.getAreas(currentSchedule.id),
    enabled: true,
  })

  const { data: days = [] } = useQuery({
    queryKey: ['days', currentSchedule.id],
    queryFn: () => daysService.getDays(currentSchedule.id),
    enabled: !!currentSchedule.id,
  })

  const createShiftMutation = useMutation({
    mutationFn: shiftService.createShift,
    onSuccess: () => {
      // Invalidate multiple query patterns to refresh all schedule views
      queryClient.invalidateQueries({ queryKey: ['shifts'] })
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] })
      onSuccess()
    },
  })

  // Update dayId when days are loaded - ensure we use a day from the current schedule
  useEffect(() => {
    if (days.length > 0) {
      // Check if current dayId exists in the loaded days (from current schedule)
      const currentDayExists = days.some(d => d.id === formData.dayId)
      
      if (!currentDayExists) {
        // Current dayId doesn't exist in this schedule, pick a default
        // Default to Monday (dayOfWeek = 1) if available, otherwise first day
        const mondayDay = days.find(d => d.dayOfWeek === 1)
        const defaultDay = mondayDay || days[0]
        setFormData(prev => ({ ...prev, dayId: defaultDay.id }))
      }
    }
  }, [days, formData.dayId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.areaId || formData.areaId === 0) {
      return
    }

    // Convert time strings to seconds and ensure schedule ID is set
    const shiftData = {
      areaId: formData.areaId,
      dayId: formData.dayId,
      startAtSeconds: timeStringToSeconds(formData.start),
      endAtSeconds: timeStringToSeconds(formData.end),
      numPeople: formData.numPeople,
      scheduleId: currentSchedule!.id,
    }
    
    createShiftMutation.mutate(shiftData)
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Auto-calculate end time when start time changes
  const handleStartTimeChange = (startTime: string) => {
    setFormData(prev => {
      const [hours, minutes] = startTime.split(':').map(Number)
      const endHours = hours + 1
      const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
      
      return {
        ...prev,
        start: startTime + ':00', // Ensure seconds are included
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
      end: endTime + ':00', // Ensure seconds are included
    }))
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
            value={formData.start.slice(0, 5)} // Remove seconds for display
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
            value={formData.end.slice(0, 5)} // Remove seconds for display
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
          min="1"
          value={formData.numPeople}
          onChange={(e) => handleInputChange('numPeople', parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      {createShiftMutation.error && (
        <div className="text-red-600 text-sm">
          {createShiftMutation.error instanceof Error 
            ? createShiftMutation.error.message 
            : 'Failed to create shift'}
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
          disabled={createShiftMutation.isPending || !formData.areaId || formData.areaId === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {createShiftMutation.isPending ? 'Creating...' : 'Create Shift'}
        </button>
      </div>
    </form>
  )
}