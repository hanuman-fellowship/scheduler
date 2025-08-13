import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesService } from '../../services/categories'

interface Category {
  id: number
  name: string
  color: string
}

interface DeleteCategoryModalProps {
  category: Category
  onSuccess: () => void
  onCancel: () => void
}

export default function DeleteCategoryModal({ 
  category, 
  onSuccess, 
  onCancel 
}: DeleteCategoryModalProps) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => categoriesService.deleteCategory(category.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      onSuccess()
    },
    onError: (error) => {
      console.error('Failed to delete category:', error)
    }
  })

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Delete Category
        </h3>
        
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to delete the category <strong>"{category.name}"</strong>?
        </p>
        
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div 
            className="w-4 h-4 border border-gray-800 rounded"
            style={{ backgroundColor: category.color }}
          />
          <span className="text-sm font-medium">{category.name}</span>
          <span className="text-xs text-gray-500">({category.color})</span>
        </div>
        
        <p className="text-sm text-red-600">
          This action cannot be undone. People in this category will need to be reassigned.
        </p>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="boxy-button-secondary"
          disabled={deleteMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Category'}
        </button>
      </div>

      {deleteMutation.error && (
        <div className="text-red-600 text-sm text-center">
          Error: {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Unknown error'}
        </div>
      )}
    </div>
  )
}