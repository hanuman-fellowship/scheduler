import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schedulesService, type Schedule } from '../../services/schedules'
import { useScheduleStore } from '../../store/scheduleStore'

interface PublishedScheduleSelectionProps {
  onCancel: () => void
  onScheduleSelected: (schedule: Schedule) => void
}

interface ScheduleGroup {
  year: string
  schedules: Schedule[]
}

export const PublishedScheduleSelection: React.FC<PublishedScheduleSelectionProps> = ({
  onCancel,
  onScheduleSelected
}) => {
  const { currentSchedule, switchToSchedule } = useScheduleStore()
  const queryClient = useQueryClient()
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set(['2024', '2025']))

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

  const toggleYear = (year: string) => {
    const newExpandedYears = new Set(expandedYears)
    if (expandedYears.has(year)) {
      newExpandedYears.delete(year)
    } else {
      newExpandedYears.add(year)
    }
    setExpandedYears(newExpandedYears)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg">Loading published schedules...</div>
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

  // Filter published schedules (name = 'Published', user_id = null)
  const publishedSchedules = (schedulesData?.mine || []).filter((schedule: any) => 
    schedule.name === 'Published'
  )

  // Map API ScheduleResponse to local Schedule type expected by the store
  const publishedSchedulesForStore: Schedule[] = publishedSchedules.map((s: any) => ({
    id: s.id,
    name: s.name,
    userId: null,
    template: Boolean(s.template),
    request: Number(s.request),
    createdAt: s.createdAt,
    updatedAt: s.updatedAt ?? s.createdAt,
  }))

  // Group by year (extract from createdAt date)
  const scheduleGroups: ScheduleGroup[] = publishedSchedulesForStore.reduce((groups, schedule) => {
    const year = new Date(schedule.createdAt).getFullYear().toString()
    const existingGroup = groups.find(g => g.year === year)
    
    if (existingGroup) {
      existingGroup.schedules.push(schedule)
    } else {
      groups.push({ year, schedules: [schedule] })
    }
    
    return groups
  }, [] as ScheduleGroup[])

  // Sort groups by year (newest first)
  scheduleGroups.sort((a, b) => parseInt(b.year) - parseInt(a.year))

  // Sort schedules within each group by date (newest first)
  scheduleGroups.forEach(group => {
    group.schedules.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  })

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <fieldset className="border border-gray-300 p-4 rounded">
          <legend className="px-2 font-bold">Select Published Schedule</legend>
          
          <div className="space-y-3">
            {scheduleGroups.map((group) => {
              const isExpanded = expandedYears.has(group.year)
              
              return (
                <div key={group.year}>
                  <button
                    onClick={() => toggleYear(group.year)}
                    className="flex items-center w-full text-left p-2 hover:bg-gray-100 rounded font-medium"
                  >
                    <span className="mr-2">{isExpanded ? '▼' : '▶'}</span>
                    <span>{group.year} ({group.schedules.length} schedules)</span>
                  </button>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                       {group.schedules.map((schedule) => {
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
                            title={`Switch to published schedule from ${new Date(schedule.createdAt).toLocaleDateString()}`}
                          >
                            <div className="text-blue-600 hover:text-blue-800 transition-colors">
                              Published - {new Date(schedule.createdAt).toLocaleDateString()}
                              {isCurrentSchedule && <span className="text-green-600 ml-2">✓ Current</span>}
                            </div>
                            <div className="text-xs text-gray-500">
                              Schedule ID: {schedule.id}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
            
            {scheduleGroups.length === 0 && (
              <p className="text-gray-500 italic">No published schedules found</p>
            )}
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