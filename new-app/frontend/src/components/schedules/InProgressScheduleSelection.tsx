import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schedulesService, type Schedule } from '../../services/schedules'
import { useScheduleStore } from '../../store/scheduleStore'
import { useAuthStore } from '../../store/authStore'

interface InProgressScheduleSelectionProps {
  onCancel: () => void
  onScheduleSelected: (schedule: Schedule) => void
}

export const InProgressScheduleSelection: React.FC<InProgressScheduleSelectionProps> = ({
  onCancel,
  onScheduleSelected
}) => {
  const { user } = useAuthStore()
  const { currentSchedule, switchToSchedule } = useScheduleStore()
  const queryClient = useQueryClient()

  const { data: schedulesData, isLoading, error } = useQuery({
    queryKey: ['schedules'],
    queryFn: schedulesService.getSchedules,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const switchScheduleMutation = useMutation({
    mutationFn: async (schedule: Schedule) => {
      switchToSchedule(schedule)
      return schedule
    },
    onSuccess: (schedule) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] })
      onScheduleSelected(schedule)
    }
  })

  const handleScheduleSelect = (schedule: Schedule) => {
    switchScheduleMutation.mutate(schedule)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg">Loading schedules...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg text-red-600">
            Error loading schedules: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    )
  }

  // Backend now returns only in-progress schedules directly
  // schedulesData.mine contains only the current user's in-progress schedules
  // schedulesData.all contains all users' in-progress schedules (for operations only)
  const mySchedules = schedulesData?.mine || []

  // Operations users also have access to other users' schedules
  // Ensure we don't show the user's own schedules in "Other Schedules"
  const myScheduleIds = new Set(mySchedules.map((s: any) => s.id))
  const otherSchedules = user?.roles.includes('operations') 
    ? (schedulesData?.all?.filter((schedule: any) => 
        !myScheduleIds.has(schedule.id) // Exclude user's own schedules
      ) || [])
    : []

  const ScheduleList = ({ schedules, title }: { schedules: Schedule[], title: string }) => (
    <div className="mb-6">
      <h3 className="font-bold mb-2">{title}</h3>
      <div className="space-y-1">
        {schedules.map((schedule) => {
          const isCurrentSchedule = currentSchedule?.id === schedule.id
          return (
            <button
              key={schedule.id}
              onClick={() => handleScheduleSelect(schedule)}
              disabled={switchScheduleMutation.isPending}
              className={`
                block w-full text-left p-2 rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                ${isCurrentSchedule ? 'bg-blue-50 font-semibold border-l-4 border-blue-500' : ''}
                ${switchScheduleMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              title={`Switch to schedule: ${schedule.name}`}
            >
              <div className="text-blue-600 hover:text-blue-800 transition-colors">
                {schedule.name}
                {isCurrentSchedule && <span className="text-green-600 ml-2">✓ Current</span>}
              </div>
              <div className="text-xs text-gray-500">
                Created {new Date(schedule.createdAt).toLocaleDateString()}
              </div>
            </button>
          )
        })}
        {schedules.length === 0 && (
          <p className="text-gray-500 italic">No schedules found</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="px-2 font-bold">Select Schedule</legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScheduleList schedules={mySchedules as Schedule[]} title="My Schedules" />
            <ScheduleList schedules={otherSchedules as Schedule[]} title="Other Schedules" />
          </div>
        </fieldset>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-600">
          {currentSchedule ? `Current: ${currentSchedule.name}` : 'No schedule selected'}
        </div>
      </div>

      {switchScheduleMutation.error && (
        <div className="text-red-600 text-sm">
          Error switching schedule: {switchScheduleMutation.error instanceof Error ? switchScheduleMutation.error.message : 'Unknown error'}
        </div>
      )}
    </div>
  )
}