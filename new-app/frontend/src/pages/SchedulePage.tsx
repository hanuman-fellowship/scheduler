import { useParams } from 'react-router-dom'

export default function SchedulePage() {
  const { id } = useParams()

  return (
    <div className="p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-4">Schedule View</h2>
        {id ? (
          <p>Loading schedule {id}...</p>
        ) : (
          <p>Please select a schedule to view.</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Schedule grid implementation coming soon.
        </p>
      </div>
    </div>
  )
}