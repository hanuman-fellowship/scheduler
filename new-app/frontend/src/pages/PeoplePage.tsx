import { useQuery } from '@tanstack/react-query'
import { peopleService } from '../services/people'
import { categoriesService } from '../services/categories'
import { useGlobalModal } from '../contexts/GlobalModalContext'

export default function PeoplePage() {
  const { openModal, openEditCategoryModal, openDeleteCategoryModal } = useGlobalModal()

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
              <span className="font-medium">{person.displayName}</span>
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
    </div>
  )
}