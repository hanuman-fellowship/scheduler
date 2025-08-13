import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../ui/Modal';

interface RestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RestorablePerson {
  id: number;
  first: string;
  last: string;
  displayName: string;
}

interface Category {
  id: number;
  name: string;
  color: string;
}

/**
 * Restore People Modal - Two-step restoration process
 * Step 1: Select person to restore
 * Step 2: Select category for restored person
 * Matches legacy CakePHP restoration interface
 */
export const RestoreModal: React.FC<RestoreModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Fetch restorable people
  const { data: restorablePeople = [], isLoading: peopleLoading } = useQuery<RestorablePerson[]>({
    queryKey: ['restorable-people'],
    queryFn: async () => {
      const response = await fetch('/api/people/restorable', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch restorable people');
      return response.json();
    },
    enabled: isOpen
  });

  // Fetch categories for step 2
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    enabled: isOpen && !!selectedPersonId
  });

  // Restore person mutation
  const restorePersonMutation = useMutation({
    mutationFn: async ({ personId, categoryId }: { personId: number; categoryId: number }) => {
      const response = await fetch(`/api/people/${personId}/restore`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ categoryId })
      });
      if (!response.ok) throw new Error('Failed to restore person');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate people queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['people'] });
      queryClient.invalidateQueries({ queryKey: ['people-by-category'] });
      queryClient.invalidateQueries({ queryKey: ['restorable-people'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      onClose();
      setSelectedPersonId(null);
    }
  });

  const handlePersonSelect = (personId: number) => {
    setSelectedPersonId(personId);
  };

  const handleCategorySelect = (categoryId: number) => {
    if (selectedPersonId) {
      restorePersonMutation.mutate({ personId: selectedPersonId, categoryId });
    }
  };

  const handleBack = () => {
    setSelectedPersonId(null);
  };

  const handleClose = () => {
    setSelectedPersonId(null);
    onClose();
  };

  const selectedPerson = restorablePeople.find(p => p.id === selectedPersonId);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Restore Person">
      <div className="space-y-4">
        {peopleLoading && (
          <div className="text-center py-4">Loading people...</div>
        )}

        {!peopleLoading && restorablePeople.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No people available to restore
          </div>
        )}

        {/* Step 1: Select person to restore */}
        {!selectedPersonId && !peopleLoading && restorablePeople.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {restorablePeople.map(person => (
              <button
                key={person.id}
                onClick={() => handlePersonSelect(person.id)}
                className="w-full text-left p-3 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {person.displayName}
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Select category for person */}
        {selectedPersonId && selectedPerson && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                Choose category for {selectedPerson.displayName}:
              </h3>
              <button
                onClick={handleBack}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                ← Back
              </button>
            </div>
            <hr />
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  disabled={restorePersonMutation.isPending}
                  className="w-full text-left p-3 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3"
                >
                  <div
                    className="w-4 h-4 border border-gray-800"
                    style={{ backgroundColor: category.color }}
                  />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
            
            {restorePersonMutation.isPending && (
              <div className="text-center text-sm text-gray-600">
                Restoring person...
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};