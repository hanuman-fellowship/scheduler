import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentService } from '../../services/assignmentService';
import Modal from '../ui/Modal';

interface AssignmentListModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftId: number;
  shiftName: string;
  onAddAssignment: () => void;
}

/**
 * Modal to view and manage current assignments for a shift
 * Small, focused component following our standards
 */
export const AssignmentListModal: React.FC<AssignmentListModalProps> = ({
  isOpen,
  onClose,
  shiftId,
  shiftName,
  onAddAssignment
}) => {
  const queryClient = useQueryClient();

  // Fetch current assignments for this shift
  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['assignments', shiftId],
    queryFn: () => assignmentService.getShiftAssignments(shiftId),
    enabled: isOpen && !!shiftId
  });

  // Delete assignment mutation
  const deleteAssignmentMutation = useMutation({
    mutationFn: assignmentService.deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] });
      queryClient.invalidateQueries({ queryKey: ['available-people', shiftId] }); // Update available people
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] }); // Legacy key
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] }); // Current schedule view
    }
  });

  // Toggle star mutation
  const toggleStarMutation = useMutation({
    mutationFn: assignmentService.toggleStar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] });
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] }); // Current schedule view
    }
  });

  const handleDelete = (assignmentId: number) => {
    if (confirm('Are you sure you want to remove this assignment?')) {
      deleteAssignmentMutation.mutate(assignmentId);
    }
  };

  const handleToggleStar = (assignmentId: number) => {
    toggleStarMutation.mutate(assignmentId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assignments for ${shiftName}`}
    >
      <div className="space-y-4">
        {/* Add assignment button */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {assignments.length} assignment{assignments.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={onAddAssignment}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Assignment
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-4">Loading assignments...</div>
        )}

        {/* Assignments list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
            >
              <div className="flex items-center space-x-3">
                {/* Star indicator */}
                <button
                  onClick={() => handleToggleStar(assignment.id)}
                  className="text-2xl"
                  title={assignment.star ? 'Unstar' : 'Star'}
                >
                  {assignment.star ? '⭐' : '☆'}
                </button>

                {/* Person name with category color */}
                <div>
                  <span
                    className="font-medium"
                    style={{ 
                      color: assignment.person?.category?.color || '#000000' 
                    }}
                  >
                    {assignment.person?.name || assignment.name || 'Unassigned'}
                  </span>
                  {assignment.person?.category && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({assignment.person.category.name})
                    </span>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(assignment.id)}
                disabled={deleteAssignmentMutation.isPending}
                className="px-3 py-1 text-red-600 hover:bg-red-50 rounded"
                title="Remove assignment"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {!isLoading && assignments.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            No assignments yet. Click "Add Assignment" to assign someone.
          </div>
        )}
      </div>
    </Modal>
  );
};