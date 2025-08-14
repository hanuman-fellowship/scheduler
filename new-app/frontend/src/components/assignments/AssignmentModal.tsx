import React, { useState, useEffect } from 'react';
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
  const [ignoreConflicts, setIgnoreConflicts] = useState(false);
  const [otherName, setOtherName] = useState('');
  const queryClient = useQueryClient();

  // Add keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
      // Invalidate relevant queries - be specific about shift assignments
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] }); // Specific shift assignments
      queryClient.invalidateQueries({ queryKey: ['assignments'] }); // General assignments
      queryClient.invalidateQueries({ queryKey: ['available-people', shiftId] }); // Update available people
      queryClient.invalidateQueries({ queryKey: ['schedule'] }); // Legacy key
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] }); // Current schedule view
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
  }, {} as Record<number, { category: { id: number; name: string; color: string }; people: AvailablePersonResponse[] }>);

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
      title="Assign Person"
    >
      <div className="space-y-4">
        {/* Header layout matching legacy - left conflict toggle, right other input */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="conflictsBox"
              checked={ignoreConflicts}
              onChange={(e) => setIgnoreConflicts(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="conflictsBox">Ignore Conflicts</label>
          </div>

          <form onSubmit={handleAssignOther} className="flex items-center space-x-2">
            <label htmlFor="other-name">Other:</label>
            <input
              id="other-name"
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              className="border rounded px-2 py-1"
              tabIndex={1}
            />
            <button
              type="submit"
              disabled={!otherName.trim() || createAssignmentMutation.isPending}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Assign
            </button>
          </form>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-4">Loading available people...</div>
        )}

        {/* People list in table format - matching legacy UI */}
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <tbody>
              <tr className="align-top">
                {Object.values(peopleByCategory)
                  .sort((a, b) => a.category.name.localeCompare(b.category.name))
                  .map(({ category, people }) => (
                    <td key={category.id} className="px-2 py-1 align-top" style={{ padding: '10px' }}>
                      <strong style={{ color: category.color }}>{category.name}</strong>
                      <br />
                      <div className="space-y-0">
                        {people
                          .filter(person => person.available || ignoreConflicts)
                          .sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name))
                          .map(person => (
                            <div key={person.id}>
                              <button
                                onClick={() => handleAssignPerson(person.id)}
                                disabled={!person.available || createAssignmentMutation.isPending}
                                className={`
                                  text-left underline hover:no-underline
                                  ${person.available 
                                    ? 'cursor-pointer' 
                                    : 'cursor-not-allowed opacity-50'
                                  }
                                `}
                                style={{ color: category.color }}
                                title={!person.available ? person.conflictReason : undefined}
                              >
                                {person.displayName || person.name}
                              </button>
                              {!person.available && (
                                <span className="text-xs text-red-500 ml-1">
                                  ({person.conflictReason})
                                </span>
                              )}
                              <br />
                            </div>
                          ))}
                      </div>
                    </td>
                  ))}
              </tr>
            </tbody>
          </table>
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