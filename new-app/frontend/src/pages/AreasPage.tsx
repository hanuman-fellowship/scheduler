import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { areasService, type Area } from '../services/areas'
import { useScheduleStore } from '../store/scheduleStore'
import { useGlobalModal } from '../contexts/GlobalModalContext'
import Modal from '../components/ui/Modal'
import EditAreaForm from '../components/areas/EditAreaForm'

export default function AreasPage() {
  const queryClient = useQueryClient()
  const { currentSchedule } = useScheduleStore()
  const { openModal } = useGlobalModal()
  
  const [editingArea, setEditingArea] = useState<Area | null>(null)
  const [confirmDeleteArea, setConfirmDeleteArea] = useState<Area | null>(null)

  const { data: areas = [], isLoading: areasLoading } = useQuery({
    queryKey: ['areas', currentSchedule?.id],
    queryFn: () => areasService.getAreas(currentSchedule?.id),
    enabled: !!currentSchedule?.id,
  })

  const deleteAreaMutation = useMutation({
    mutationFn: areasService.deleteArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['areas'] })
      setConfirmDeleteArea(null)
    },
  })

  const handleDeleteArea = (area: Area) => {
    setConfirmDeleteArea(area)
  }

  const confirmDelete = () => {
    if (confirmDeleteArea) {
      deleteAreaMutation.mutate(confirmDeleteArea.id)
    }
  }

  if (!currentSchedule) {
    return <div className="p-4 text-center">Loading schedule context...</div>
  }

  if (areasLoading) {
    return <div className="p-4 text-center">Loading areas...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Areas Management</h1>
        <button
          onClick={() => openModal('area')}
          className="boxy-button"
        >
          New Area...
        </button>
      </div>

      {/* Areas List */}
      <div className="space-y-2">
        {areas.map((area) => (
          <div 
            key={area.id}
            className="flex items-center justify-between p-4 border border-gray-300 rounded hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <span className="font-medium text-lg">{area.name}</span>
                <span className="text-sm text-gray-600">
                  Short name: {area.shortName}
                </span>
                {area.notes && (
                  <span className="text-sm text-gray-600 italic">
                    Notes: {area.notes}
                  </span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setEditingArea(area)}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteArea(area)}
                className="px-3 py-1 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {areas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No areas yet. Create one to get started.</p>
            <button
              onClick={() => openModal('area')}
              className="boxy-button"
            >
              Create First Area
            </button>
          </div>
        )}
      </div>

      {/* Edit Area Modal */}
      <Modal
        isOpen={!!editingArea}
        onClose={() => setEditingArea(null)}
        title="Edit Area"
      >
        {editingArea && (
          <EditAreaForm
            area={editingArea}
            onSuccess={() => setEditingArea(null)}
            onCancel={() => setEditingArea(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!confirmDeleteArea}
        onClose={() => setConfirmDeleteArea(null)}
        title="Confirm Delete Area"
      >
        {confirmDeleteArea && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete the area "{confirmDeleteArea.name}"?
            </p>
            <p className="text-sm text-red-600 font-medium">
              Warning: This will also delete all shifts and assignments in this area.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setConfirmDeleteArea(null)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                disabled={deleteAreaMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={deleteAreaMutation.isPending}
              >
                {deleteAreaMutation.isPending ? 'Deleting...' : 'Delete Area'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}