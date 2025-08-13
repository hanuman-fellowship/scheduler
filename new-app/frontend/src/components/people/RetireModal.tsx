import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';

interface RetireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryGroup {
  category: {
    id: number;
    name: string;
    color: string;
    sortOrder: number;
  };
  people: Array<{
    id: number;
    first: string;
    last: string;
    displayName: string;
  }>;
}

/**
 * Retire People Modal - Bulk retirement functionality
 * Matches legacy CakePHP retirement interface
 */
export const RetireModal: React.FC<RetireModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedPeople, setSelectedPeople] = useState<number[]>([]);
  const [selectAllByCategory, setSelectAllByCategory] = useState<{[categoryId: number]: boolean}>({});
  const queryClient = useQueryClient();

  // Fetch people grouped by category  
  const { data: peopleByCategory = {}, isLoading } = useQuery<{[key: string]: CategoryGroup}>({
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
    enabled: isOpen
  });

  // Retire people mutation
  const retirePeopleMutation = useMutation({
    mutationFn: async (peopleIds: number[]) => {
      const response = await fetch('/api/people/retire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ peopleIds })
      });
      if (!response.ok) throw new Error('Failed to retire people');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate people queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['people-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      onClose();
      setSelectedPeople([]);
      setSelectAllByCategory({});
    }
  });

  const handlePersonToggle = (personId: number) => {
    setSelectedPeople(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const handleSelectAllCategory = (categoryId: number, people: any[]) => {
    const categoryPeopleIds = people.map(p => p.id);
    const allSelected = categoryPeopleIds.every(id => selectedPeople.includes(id));
    
    if (allSelected) {
      // Unselect all in this category
      setSelectedPeople(prev => prev.filter(id => !categoryPeopleIds.includes(id)));
      setSelectAllByCategory(prev => ({ ...prev, [categoryId]: false }));
    } else {
      // Select all in this category
      setSelectedPeople(prev => [...new Set([...prev, ...categoryPeopleIds])]);
      setSelectAllByCategory(prev => ({ ...prev, [categoryId]: true }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPeople.length > 0) {
      retirePeopleMutation.mutate(selectedPeople);
    }
  };

  // Sort categories by sort order
  const sortedCategories = Object.values(peopleByCategory).sort((a, b) => 
    a.category.sortOrder - b.category.sortOrder
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Retire People">
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-4">Loading people...</div>
        )}

        {!isLoading && sortedCategories.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No people found to retire
          </div>
        )}

        {!isLoading && sortedCategories.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-96 overflow-y-auto">
              {sortedCategories.map(({ category, people }) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 border border-gray-800"
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                  </div>
                  
                  <div className="space-y-1">
                    {people.map(person => (
                      <label
                        key={person.id}
                        className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                        style={{ color: category.color }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPeople.includes(person.id)}
                          onChange={() => handlePersonToggle(person.id)}
                          className="rounded"
                        />
                        <span>{person.displayName}</span>
                      </label>
                    ))}
                  </div>
                  
                  <hr className="my-2" />
                  
                  <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectAllByCategory[category.id] || false}
                      onChange={() => handleSelectAllCategory(category.id, people)}
                      className="rounded"
                    />
                    <span>All</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-gray-600">
                {selectedPeople.length} people selected for retirement
              </span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedPeople.length === 0 || retirePeopleMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {retirePeopleMutation.isPending ? 'Retiring...' : 'Retire People'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};