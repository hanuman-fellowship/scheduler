import React from 'react'
import { useScheduleStore } from '../../store/scheduleStore'
import { useAuthStore } from '../../store/authStore'

export const ScheduleStatusIndicator: React.FC = () => {
  const { currentSchedule, isEditable, isPublished, isRequest } = useScheduleStore()
  const { isOperations } = useAuthStore()

  if (!currentSchedule) {
    return (
      <div className="text-sm text-gray-500 italic">
        No schedule selected
      </div>
    )
  }

  const getStatusText = () => {
    if (isEditable()) {
      return (
        <span className="text-green-600 font-semibold">
          ✏️ Editing: {currentSchedule.name}
        </span>
      )
    }
    
    if (isPublished()) {
      const publishedDate = new Date(currentSchedule.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
      return (
        <span className="text-blue-600">
          📅 Published on {publishedDate}
        </span>
      )
    }
    
    if (isRequest()) {
      return (
        <span className="text-orange-600">
          📝 Request: {currentSchedule.name}
        </span>
      )
    }
    
    if (currentSchedule.userId) {
      // Viewing another user's schedule
      return (
        <span className="text-blue-600">
          👀 Viewing: {currentSchedule.name}
        </span>
      )
    }
    
    return (
      <span className="text-gray-600">
        📋 {currentSchedule.name}
      </span>
    )
  }

  const getActionButtons = () => {
    if (!isOperations()) return null
    
    if (isEditable()) {
      return (
        <button
          className="ml-3 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
          title="This schedule can be edited"
        >
          🔓 Editable
        </button>
      )
    }
    
    if (isPublished()) {
      return (
        <button
          className="ml-3 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          title="Published schedule - read only"
        >
          🔒 Read Only
        </button>
      )
    }
    
    return (
      <button
        className="ml-3 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        title="Viewing schedule - read only"
      >
        👁️ View Only
      </button>
    )
  }

  return (
    <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-2">
      <div className="flex items-center">
        <div className="text-sm">
          {getStatusText()}
        </div>
        {getActionButtons()}
      </div>
      
      <div className="text-xs text-gray-500">
        Schedule ID: {currentSchedule.id}
      </div>
    </div>
  )
}