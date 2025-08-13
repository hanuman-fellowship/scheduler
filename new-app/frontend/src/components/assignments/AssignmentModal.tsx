import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { AvailablePersonResponse } from '@shared/types';
import { assignmentService } from '../../services/assignmentService';
import Modal from '../ui/Modal';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
  shiftName: string;
}

/**
 * Assignment modal component for assigning people to shifts
 * Follows legacy UI patterns with categories and conflict detection
 */
export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  shiftId,
  shiftName
}) => {
  const [showConflicts, setShowConflicts] = useState(false);
  const [otherName, setOtherName] = useState('');
  const queryClient = useQueryClient();

  // Fetch available people for this shift
  const { data: availablePeople = [], isLoading } = useQuery({
    queryKey: ['available-people', shiftId],
    queryFn: () => assignmentService.getAvailablePeople(shiftId),
    enabled: isOpen && !!shiftId
  });

  // Create assignment mutation
  const createAssignmentMutation = useMutation({
    mutationFn: assignmentService.createAssignment,
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      onClose();
    }
  });

  // Group people by category (matching legacy UI)
  const peopleByCategory = availablePeople.reduce((acc, person) => {
    const categoryId = person.category.id;
    if (!acc[categoryId]) {
      acc[categoryId] = {
        category: person.category,
        people: []
      };
    }
    acc[categoryId].people.push(person);
    return acc;
  }, {} as Record<number, { category: any; people: AvailablePersonResponse[] }>);

  const handleAssignPerson = (personId: number) => {
    createAssignmentMutation.mutate({
      shiftId,
      personId,
      name: undefined
    });
  };

  const handleAssignOther = (e: React.FormEvent) => {
    e.preventDefault();
    if (otherName.trim()) {
      createAssignmentMutation.mutate({
        shiftId,
        personId: null,
        name: otherName.trim()
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Person to ${shiftName}`}
    >
      <div className="space-y-4">
        {/* Conflict toggle - matching legacy UI */}
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showConflicts}
              onChange={(e) => setShowConflicts(e.target.checked)}
              className="rounded"
            />
            <span>Show People with Conflicts</span>
          </label>

          {/* Other name input - matching legacy UI */}
          <form onSubmit={handleAssignOther} className="flex items-center space-x-2">
            <label htmlFor="other-name">Other:</label>
            <input
              id="other-name"
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="Custom name"
            />
            <button
              type="submit"
              disabled={!otherName.trim() || createAssignmentMutation.isPending}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Assign
            </button>
          </form>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-4">Loading available people...</div>
        )}

        {/* People list grouped by category - matching legacy UI */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {Object.values(peopleByCategory).map(({ category, people }) => (
            <div key={category.id} className="space-y-1">
              <h3 
                className="font-semibold"
                style={{ color: category.color }}
              >
                {category.name}
              </h3>
              <div className="space-y-1">
                {people
                  .filter(person => showConflicts || person.available)
                  .map(person => (
                    <button
                      key={person.id}
                      onClick={() => handleAssignPerson(person.id)}
                      disabled={!person.available || createAssignmentMutation.isPending}
                      className={`
                        block w-full text-left px-2 py-1 rounded
                        ${person.available 
                          ? 'hover:bg-gray-100 cursor-pointer' 
                          : 'opacity-50 cursor-not-allowed bg-red-50'
                        }
                      `}
                      style={{ color: category.color }}
                      title={!person.available ? person.conflictReason : undefined}
                    >
                      {person.name}
                      {!person.available && (
                        <span className="text-xs text-red-500 ml-2">
                          ({person.conflictReason})
                        </span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* No people available message */}
        {!isLoading && availablePeople.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No people available for this shift
          </div>
        )}
      </div>
    </Modal>
  );
};