import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../services/people'
import { categoriesService } from '../services/categories'
import { useGlobalModal } from '../contexts/GlobalModalContext'
import { RetireModal } from '../components/people/RetireModal'
import { RestoreModal } from '../components/people/RestoreModal'

export default function PeoplePage() {
  const { openModal, openEditCategoryModal, openDeleteCategoryModal } = useGlobalModal()
  const [retireModalOpen, setRetireModalOpen] = useState(false)
  const [restoreModalOpen, setRestoreModalOpen] = useState(false)

  // Get people grouped by category for enhanced display
  const { data: peopleByCategory = {}, isLoading: peopleLoading } = useQuery({
    queryKey: ['people-by-category'],
    queryFn: async () => {
      const response = await fetch('/api/people/by-category', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch people');
      return response.json();
    },
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  })

  if (peopleLoading) {
    return <div className="p-4 text-center">Loading people...</div>
  }

  // Sort categories by sort order
  const sortedCategories = Object.values(peopleByCategory).sort((a: any, b: any) => 
    a.category.sortOrder - b.category.sortOrder
  );

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">People Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setRetireModalOpen(true)}
            className="boxy-button bg-red-600 text-white hover:bg-red-700"
          >
            Retire People...
          </button>
          <button
            onClick={() => setRestoreModalOpen(true)}
            className="boxy-button bg-green-600 text-white hover:bg-green-700"
          >
            Restore People...
          </button>
          <button
            onClick={() => openModal('category')}
            className="boxy-button"
          >
            New Category...
          </button>
          <button
            onClick={() => openModal('person')}
            className="boxy-button"
          >
            New Person...
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-bold mb-4">Categories</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="flex items-center justify-between p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="w-4 h-4 border border-gray-800"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-600">({category.color})</span>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => openEditCategoryModal(category)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded text-sm"
                  title="Edit category"
                >
                  ✏️
                </button>
                <button
                  onClick={() => openDeleteCategoryModal(category)}
                  className="text-red-600 hover:text-red-800 p-1 rounded text-sm"
                  title="Delete category"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-600">No categories yet. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* People grouped by category */}
      <div>
        <h2 className="text-lg font-bold mb-4">People</h2>
        {sortedCategories.length === 0 && (
          <p className="text-gray-600">No people yet. Add some to get started.</p>
        )}
        
        <div className="space-y-6">
          {sortedCategories.map((categoryGroup: any) => (
            <div key={categoryGroup.category.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div
                  className="w-5 h-5 border border-gray-800"
                  style={{ backgroundColor: categoryGroup.category.color }}
                />
                <h3 className="font-semibold text-lg">{categoryGroup.category.name}</h3>
                <span className="text-sm text-gray-500">({categoryGroup.people.length} people)</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {categoryGroup.people.map((person: any) => (
                  <div
                    key={person.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50"
                    style={{ color: categoryGroup.category.color }}
                  >
                    <span className="font-medium">{person.displayName}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Retire/Restore Modals */}
      <RetireModal 
        isOpen={retireModalOpen} 
        onClose={() => setRetireModalOpen(false)} 
      />
      <RestoreModal 
        isOpen={restoreModalOpen} 
        onClose={() => setRestoreModalOpen(false)} 
      />
    </div>
  )
}