import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Modal from '../components/ui/Modal'
import AddShiftForm from '../components/shifts/AddShiftForm'

export default function ShiftsAddPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Get URL parameters if provided
  const areaId = searchParams.get('areaId')
  const dayId = searchParams.get('dayId')
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  const handleSuccess = () => {
    // Go back to where we came from, or to people page by default
    navigate(-1)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <div className="p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">New Shift</h1>
        <div className="bg-white rounded-lg border border-gray-300 p-6">
          <AddShiftForm
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            initialAreaId={areaId ? parseInt(areaId) : undefined}
            initialDayId={dayId ? parseInt(dayId) : undefined}
            initialStart={start || undefined}
            initialEnd={end || undefined}
          />
        </div>
      </div>
    </div>
  )
}