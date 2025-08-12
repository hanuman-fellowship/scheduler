import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../services/people'
import { categoriesService } from '../services/categories'
import Modal from '../components/ui/Modal'
import AddPersonForm from '../components/people/AddPersonForm'
import AddCategoryForm from '../components/people/AddCategoryForm'

export default function PeoplePage() {
  const location = useLocation()
  const [showAddPerson, setShowAddPerson] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)

  // Auto-open Add Person modal if opened via navigation state
  useEffect(() => {
    if (location.state?.openAddPersonModal) {
      setShowAddPerson(true)
      // Clear the state to prevent modal from reopening on refresh
      window.history.replaceState(null, '', location.pathname)
    }
  }, [location.state, location.pathname])

  const { data: people = [], isLoading: peopleLoading } = useQuery({
    queryKey: ['people'],
    queryFn: peopleService.getPeople,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getCategories,
  })

  if (peopleLoading) {
    return <div className="p-4 text-center">Loading people...</div>
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">People Management</h1>
        <div className="space-x-2">
          <button
            onClick={() => setShowAddCategory(true)}
            className="boxy-button"
          >
            New Category...
          </button>
          <button
            onClick={() => setShowAddPerson(true)}
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
              className="flex items-center space-x-4 p-2 border border-gray-300 rounded"
            >
              <div 
                className="w-4 h-4 border border-gray-800"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-medium">{category.name}</span>
              <span className="text-sm text-gray-600">({category.color})</span>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-600">No categories yet. Create one to get started.</p>
          )}
        </div>
      </div>

      {/* People */}
      <div>
        <h2 className="text-lg font-bold mb-4">People</h2>
        <div className="space-y-2">
          {people.map((person) => (
            <div 
              key={person.id}
              className="flex items-center space-x-4 p-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              <div 
                className="w-4 h-4 border border-gray-800"
                style={{ backgroundColor: person.category?.color || '#ccc' }}
              />
              <span className="font-medium">{person.name}</span>
              <span className="text-sm text-gray-600">
                ({person.category?.name || 'No category'})
              </span>
            </div>
          ))}
          {people.length === 0 && (
            <p className="text-gray-600">No people yet. Add some to get started.</p>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddPerson}
        onClose={() => setShowAddPerson(false)}
        title="Add Person"
      >
        <AddPersonForm
          onSuccess={() => setShowAddPerson(false)}
          onCancel={() => setShowAddPerson(false)}
        />
      </Modal>

      <Modal
        isOpen={showAddCategory}
        onClose={() => setShowAddCategory(false)}
        title="New Resident Category"
      >
        <AddCategoryForm
          onSuccess={() => setShowAddCategory(false)}
          onCancel={() => setShowAddCategory(false)}
        />
      </Modal>
    </div>
  )
}