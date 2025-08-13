import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../../services/requestService';
import { NewRequestModal } from './NewRequestModal';
import { useAuthStore } from '../../store/authStore';
import { DraftRequestResponse } from '@shared/types';

export const RequestsPage: React.FC = () => {
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<number>(0);
  const [selectedAreaName, setSelectedAreaName] = useState<string>('');
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch draft requests
  const { data: draftRequests = [], isLoading } = useQuery({
    queryKey: ['draft-requests'],
    queryFn: requestService.getDraftRequests,
    enabled: user?.roles.includes('manager') || user?.roles.includes('operations')
  });

  // Submit request mutation
  const submitRequestMutation = useMutation({
    mutationFn: (requestId: number) => requestService.submitRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['draft-requests'] });
      const request = draftRequests.find(r => r.id === requestId);
      alert(`Request "${request?.name}" submitted successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to submit request: ${error.response?.data?.error || error.message}`);
    }
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => requestService.deleteRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['draft-requests'] });
      const request = draftRequests.find(r => r.id === requestId);
      alert(`Request "${request?.name}" deleted successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to delete request: ${error.response?.data?.error || error.message}`);
    }
  });

  const handleNewRequest = () => {
    // For now, we'll use a hardcoded area ID. In a full implementation,
    // we'd show an area selection modal first
    setSelectedAreaId(1); // This should come from area selection
    setSelectedAreaName('Kitchen'); // This should come from area selection
    setShowNewRequestModal(true);
  };

  const handleSubmitRequest = (requestId: number, requestName: string) => {
    if (confirm(`Are you sure you want to submit "${requestName}"? You won't be able to edit it after submission.`)) {
      submitRequestMutation.mutate(requestId);
    }
  };

  const handleDeleteRequest = (requestId: number, requestName: string) => {
    if (confirm(`Are you sure you want to delete "${requestName}"? This action cannot be undone.`)) {
      deleteRequestMutation.mutate(requestId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!user?.roles.includes('manager') && !user?.roles.includes('operations')) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You must be a manager to access request management.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Request Management</h1>
        <button
          onClick={handleNewRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Request...
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading requests...</div>
        </div>
      ) : draftRequests.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No draft requests found</div>
          <p className="text-sm text-gray-400">
            Create a new request to get started with schedule planning
          </p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Draft Requests</h3>
            <div className="space-y-4">
              {draftRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onSubmit={() => handleSubmitRequest(request.id, request.name)}
                  onDelete={() => handleDeleteRequest(request.id, request.name)}
                  isSubmitting={submitRequestMutation.isPending}
                  isDeleting={deleteRequestMutation.isPending}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <NewRequestModal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        areaId={selectedAreaId}
        areaName={selectedAreaName}
      />
    </div>
  );
};

// Request card component
interface RequestCardProps {
  request: DraftRequestResponse;
  onSubmit: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
  isDeleting: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onSubmit,
  onDelete,
  isSubmitting,
  isDeleting
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{request.name}</h4>
          <div className="mt-1 text-sm text-gray-500">
            <div>Area: {request.areaName}</div>
            <div>Created: {formatDate(request.createdAt)}</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Draft
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => {
              // In a full implementation, this would navigate to the schedule editor
              // with the request context
              alert('Edit functionality would open the schedule editor for this request');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          
          <button
            onClick={onSubmit}
            disabled={isSubmitting || isDeleting}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          
          <button
            onClick={onDelete}
            disabled={isSubmitting || isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};