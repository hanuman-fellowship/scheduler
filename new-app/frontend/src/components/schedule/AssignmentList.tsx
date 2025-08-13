import React from 'react';
import type { AssignmentResponse } from '@shared/types';

interface AssignmentListProps {
  assignments: AssignmentResponse[];
  numPeople: number;
  editable: boolean;
  onAssignmentClick?: (assignmentId: number) => void;
  onUnassign?: (assignmentId: number) => void;
}

export const AssignmentList: React.FC<AssignmentListProps> = ({
  assignments,
  numPeople,
  editable,
  onAssignmentClick,
  onUnassign
}) => {
  // Calculate unassigned slots
  const unassignedCount = numPeople - assignments.length;

  return (
    <>
      {/* Render assigned people */}
      {assignments.map(assignment => (
        <span 
          key={assignment.id} 
          className={`assignment ${assignment.star ? 'starred' : ''}`}
          style={{ 
            color: assignment.person?.category?.color || 'inherit',
            cursor: editable ? 'pointer' : 'default'
          }}
          onClick={() => editable && onAssignmentClick?.(assignment.id)}
        >
          {assignment.star && <span className="star">★ </span>}
          {assignment.person ? 
            `${assignment.person.name}` : 
            assignment.name || 'Unknown'}
          {editable && (
            <button
              className="unassign-button"
              onClick={(e) => {
                e.stopPropagation();
                onUnassign?.(assignment.id);
              }}
              aria-label="Unassign"
            >
              ×
            </button>
          )}
          <br />
        </span>
      ))}

      {/* Render unassigned placeholders */}
      {Array.from({ length: unassignedCount }, (_, index) => (
        <span key={`unassigned-${index}`} className="assignment unassigned">
          ________
          <br />
        </span>
      ))}
    </>
  );
};