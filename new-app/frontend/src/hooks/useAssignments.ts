import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assignmentService } from '../services/assignmentService';

/**
 * Custom hook for managing assignment operations
 * Following our pattern of separating logic from components
 */
export const useAssignments = (shiftId?: number) => {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Query for available people
  const availablePeopleQuery = useQuery({
    queryKey: ['available-people', selectedShift?.id],
    queryFn: () => selectedShift ? assignmentService.getAvailablePeople(selectedShift.id) : [],
    enabled: !!selectedShift?.id && isAssignModalOpen
  });

  // Query for current assignments
  const assignmentsQuery = useQuery({
    queryKey: ['assignments', selectedShift?.id || shiftId],
    queryFn: () => {
      const id = selectedShift?.id || shiftId;
      return id ? assignmentService.getShiftAssignments(id) : [];
    },
    enabled: !!(selectedShift?.id || shiftId)
  });

  const openAssignModal = (shift: { id: number; name: string }) => {
    setSelectedShift(shift);
    setIsAssignModalOpen(true);
    setIsListModalOpen(false);
  };

  const openListModal = (shift: { id: number; name: string }) => {
    setSelectedShift(shift);
    setIsListModalOpen(true);
    setIsAssignModalOpen(false);
  };

  const closeModals = () => {
    setIsAssignModalOpen(false);
    setIsListModalOpen(false);
  };

  const switchToAssignModal = () => {
    setIsAssignModalOpen(true);
    setIsListModalOpen(false);
  };

  return {
    // State
    isAssignModalOpen,
    isListModalOpen,
    selectedShift,
    
    // Queries
    availablePeople: availablePeopleQuery.data || [],
    assignments: assignmentsQuery.data || [],
    isLoadingAvailablePeople: availablePeopleQuery.isLoading,
    isLoadingAssignments: assignmentsQuery.isLoading,
    
    // Actions
    openAssignModal,
    openListModal,
    closeModals,
    switchToAssignModal
  };
};