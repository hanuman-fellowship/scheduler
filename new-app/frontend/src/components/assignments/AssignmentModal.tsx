import React, { useState, useEffect, useRef } from 'react';
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
 * Scheduler3-style assignment modal with exact visual and interaction patterns
 * Matches legacy CakePHP implementation pixel-perfectly
 */
export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  shiftId,
  shiftName
}) => {
  const [ignoreConflicts, setIgnoreConflicts] = useState(false);
  const [communityHours, setCommunityHours] = useState(false);
  const [recurring, setRecurring] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [typeBuffer, setTypeBuffer] = useState('');
  const [lastTypedAt, setLastTypedAt] = useState(0);
  
  const contentRef = useRef<HTMLDivElement>(null);
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
      queryClient.invalidateQueries({ queryKey: ['shifts'] });
      queryClient.invalidateQueries({ queryKey: ['assignments', shiftId] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['available-people', shiftId] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      queryClient.invalidateQueries({ queryKey: ['scheduleView'] });
      onClose();
    }
  });

  // Group people by category and create flat list for navigation
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

  // Create flat list of visible people for keyboard navigation
  const visiblePeople = Object.values(peopleByCategory)
    .sort((a, b) => a.category.name.localeCompare(b.category.name))
    .flatMap(({ people }) => 
      people
        .filter(person => person.available || ignoreConflicts)
        .sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name))
    );

  // Keyboard navigation and shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in assignment name field
      if ((e.target as HTMLElement)?.id === 'assignment_name') return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          selectNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectPrev();
          break;
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            selectPrev();
          } else {
            selectNext();
          }
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < visiblePeople.length) {
            handleAssignPerson(visiblePeople[selectedIndex].id);
          }
          break;
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      // Skip if typing in assignment name field
      if ((e.target as HTMLElement)?.id === 'assignment_name') return;
      if (!visiblePeople.length) return;

      const letter = String.fromCharCode(e.which || e.keyCode);
      const now = Date.now();
      
      // Reset buffer if too much time has passed
      if (now - lastTypedAt > 900) {
        setTypeBuffer('');
      }
      
      const newBuffer = (now - lastTypedAt > 900 ? '' : typeBuffer) + letter;
      setTypeBuffer(newBuffer);
      setLastTypedAt(now);
      
      // Find matching person
      const matchingIndex = visiblePeople.findIndex(person => 
        (person.displayName || person.name).toLowerCase().startsWith(newBuffer.toLowerCase())
      );
      
      if (matchingIndex >= 0) {
        setSelectedIndex(matchingIndex);
        scrollToSelected(matchingIndex);
      }

      // Prevent space from scrolling page
      if (e.key === ' ') {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keypress', handleKeyPress);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [isOpen, selectedIndex, visiblePeople, typeBuffer, lastTypedAt, onClose]);

  const selectNext = () => {
    if (visiblePeople.length === 0) return;
    const nextIndex = selectedIndex >= visiblePeople.length - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(nextIndex);
    scrollToSelected(nextIndex);
  };

  const selectPrev = () => {
    if (visiblePeople.length === 0) return;
    const prevIndex = selectedIndex <= 0 ? visiblePeople.length - 1 : selectedIndex - 1;
    setSelectedIndex(prevIndex);
    scrollToSelected(prevIndex);
  };

  const scrollToSelected = (index: number) => {
    const element = document.querySelector(`[data-person-index="${index}"]`);
    if (element && contentRef.current) {
      const elementRect = element.getBoundingClientRect();
      const containerRect = contentRef.current.getBoundingClientRect();
      const scrollTop = contentRef.current.scrollTop;
      const targetScrollTop = scrollTop + elementRect.top - containerRect.top - containerRect.height / 2 + elementRect.height / 2;
      
      contentRef.current.scrollTop = targetScrollTop;
    }
  };

  const handleAssignPerson = (personId: number) => {
    createAssignmentMutation.mutate({
      shiftId,
      personId,
      name: undefined,
      communityHours,
      recurring
    });
  };

  const handleAssignOther = (e: React.FormEvent) => {
    e.preventDefault();
    if (otherName.trim()) {
      createAssignmentMutation.mutate({
        shiftId,
        personId: null,
        name: otherName.trim(),
        communityHours,
        recurring
      });
    }
  };

  const handleIgnoreConflictsChange = (checked: boolean) => {
    setIgnoreConflicts(checked);
    // Reset selection when toggling conflicts
    setSelectedIndex(-1);
  };

  // Actions JSX for the modal
  const actions = (
    <>
      <div className="form-check" style={{ display: 'inline-block', marginRight: '1em' }}>
        <input
          type="checkbox"
          id="ignore_conflicts"
          name="ignore_conflicts"
          checked={ignoreConflicts}
          onChange={(e) => handleIgnoreConflictsChange(e.target.checked)}
        />
        <label htmlFor="ignore_conflicts" style={{ marginLeft: '0.25em' }}>Ignore Conflicts</label>
      </div>
      
      <div className="form-check" style={{ display: 'inline-block', marginRight: '1em' }}>
        <input
          type="checkbox"
          id="community_hours"
          name="community_hours"
          checked={communityHours}
          onChange={(e) => setCommunityHours(e.target.checked)}
        />
        <label htmlFor="community_hours" style={{ marginLeft: '0.25em' }}>Community Hours</label>
      </div>
      
      <div className="form-check" style={{ display: 'inline-block' }}>
        <input
          type="checkbox"
          id="recurring"
          name="recurring"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
        />
        <label htmlFor="recurring" style={{ marginLeft: '0.25em' }}>Recurring (copy when copying weeks)</label>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign"
      actions={actions}
    >
      <div ref={contentRef}>
        {/* Assignment name input */}
        <input
          type="text"
          id="assignment_name"
          className="form-control"
          placeholder="Other assignment name..."
          value={otherName}
          onChange={(e) => setOtherName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAssignOther(e);
            }
          }}
          style={{
            width: '100%',
            padding: '0.375rem 0.75rem',
            marginBottom: '1rem',
            border: '1px solid #ced4da',
            borderRadius: '0.25rem'
          }}
        />

        {/* Loading state */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>Loading available people...</div>
        )}

        {/* People list - scheduler3 style */}
        <div
          id="assign_shifts"
          className={ignoreConflicts ? 'from_area ignore_conflicts' : 'from_area'}
          style={{
            marginTop: '1em',
            whiteSpace: 'nowrap'
          }}
        >
          {Object.values(peopleByCategory)
            .sort((a, b) => a.category.name.localeCompare(b.category.name))
            .map(({ category, people }) => {
              const visibleCategoryPeople = people
                .filter(person => person.available || ignoreConflicts)
                .sort((a, b) => (a.displayName || a.name).localeCompare(b.displayName || b.name));
              
              if (visibleCategoryPeople.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <h5 style={{
                    marginTop: '.5em',
                    marginBottom: 0,
                    whiteSpace: 'nowrap'
                  }}>
                    {category.name}
                  </h5>
                  
                  {visibleCategoryPeople.map((person) => {
                    const personGlobalIndex = visiblePeople.findIndex(p => p.id === person.id);
                    const isSelected = personGlobalIndex === selectedIndex;
                    const isConflicting = !person.available;
                    
                    return (
                      <div
                        key={person.id}
                        data-person-index={personGlobalIndex}
                        className={`assign_shift${isConflicting ? ' conflicting' : ''}`}
                        style={{
                          color: category.color,
                          display: isConflicting && !ignoreConflicts ? 'none' : 'block'
                        }}
                        onMouseEnter={() => {
                          setSelectedIndex(personGlobalIndex);
                          // Clear type buffer when hovering
                          setTypeBuffer('');
                        }}
                        onMouseLeave={() => {
                          // Don't clear selection on mouse leave to maintain keyboard navigation
                        }}
                      >
                        <a
                          href="#"
                          className={`type_selectable${isSelected ? ' selected' : ''}`}
                          data-num={personGlobalIndex + 1}
                          data-shift-id={shiftId}
                          data-person-id={person.id}
                          data-for="area"
                          style={{
                            display: 'inline-block',
                            color: 'inherit',
                            textDecoration: 'none',
                            backgroundColor: isSelected ? '#b8e0ff' : 'transparent', // darken(#d0ecff, 15%)
                            padding: isSelected ? '2px 4px' : '2px 4px',
                            outline: 'none'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleAssignPerson(person.id);
                          }}
                          onFocus={() => setSelectedIndex(personGlobalIndex)}
                        >
                          {person.displayName || person.name}
                        </a>
                        
                        {isConflicting && (
                          <div
                            className="conflict_notice hover_for_more"
                            data-s-id={shiftId}
                            data-p-id={person.id}
                            style={{
                              display: 'inline-block',
                              marginLeft: '4px',
                              color: '#f39c12' // Orange warning color
                            }}
                            title={person.conflictReason}
                          >
                            ⚠️
                            <span style={{ display: 'none' }}>{person.conflictReason}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
        </div>

        {/* No people available message */}
        {!isLoading && availablePeople.length === 0 && (
          <div style={{ textAlign: 'center', color: '#6c757d', padding: '1rem' }}>
            No people available for this shift
          </div>
        )}
      </div>
    </Modal>
  );
};