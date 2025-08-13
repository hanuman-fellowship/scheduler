import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../../services/requestService';
import { useAuthStore } from '../../store/authStore';
import { RequestsByArea, RequestResponse } from '@shared/types';

export const SubmittedRequestsPage: React.FC = () => {
  const [expandedAreas, setExpandedAreas] = useState<Set<number>>(new Set());
  
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // Fetch submitted requests
  const { data: requestsByArea = {}, isLoading } = useQuery({
    queryKey: ['submitted-requests'],
    queryFn: requestService.getSubmittedRequests,
    enabled: user?.roles.includes('operations')
  });

  // Accept request mutation
  const acceptRequestMutation = useMutation({
    mutationFn: ({ requestId, clearAreaFirst }: { requestId: number; clearAreaFirst: boolean }) => 
      requestService.acceptRequest(requestId, clearAreaFirst),
    onSuccess: (_, { requestId }) => {
      queryClient.invalidateQueries({ queryKey: ['submitted-requests'] });
      // Find the request name for the success message
      const request = findRequestById(requestId);
      alert(`Request "${request?.name}" accepted and merged successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to accept request: ${error.response?.data?.error || error.message}`);
    }
  });

  // Delete request mutation
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => requestService.deleteRequest(requestId),
    onSuccess: (_, requestId) => {
      queryClient.invalidateQueries({ queryKey: ['submitted-requests'] });
      const request = findRequestById(requestId);
      alert(`Request "${request?.name}" deleted successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to delete request: ${error.response?.data?.error || error.message}`);
    }
  });

  const findRequestById = (requestId: number): RequestResponse | undefined => {
    for (const areaData of Object.values(requestsByArea)) {
      const request = areaData.requests.find(r => r.id === requestId);
      if (request) return request;
    }
    return undefined;
  };

  const toggleArea = (index: number) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedAreas(newExpanded);
  };

  const handleAcceptRequest = (requestId: number, requestName: string) => {
    const clearAreaFirst = confirm(
      `Accept "${requestName}"?\n\n` +
      'Click OK to CLEAR existing shifts in this area first (recommended)\n' +
      'Click Cancel to MERGE with existing shifts'
    );
    
    acceptRequestMutation.mutate({ requestId, clearAreaFirst });
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

  if (!user?.roles.includes('operations')) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">You must be an operations user to review submitted requests.</p>
      </div>
    );
  }

  const areaNames = Object.keys(requestsByArea);
  const totalRequests = areaNames.reduce((sum, areaName) => 
    sum + requestsByArea[areaName].requests.length, 0
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Submitted Requests
          {totalRequests > 0 && (
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({totalRequests} pending)
            </span>
          )}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading submitted requests...</div>
        </div>
      ) : areaNames.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">No submitted requests found</div>
          <p className="text-sm text-gray-400">
            Requests will appear here when managers submit them for approval
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {areaNames.map((areaName, index) => {
            const areaData = requestsByArea[areaName];
            const isExpanded = expandedAreas.has(index);
            
            return (
              <div key={areaName} className="bg-white shadow rounded-lg">
                <div 
                  className="px-4 py-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => toggleArea(index)}
                >
                  <div className="flex items-center">
                    <span className="text-lg font-medium text-gray-900">
                      {areaData.areaName}
                    </span>
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {areaData.requests.length} request{areaData.requests.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    {isExpanded ? '−' : '+'}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t px-4 py-4 space-y-4">
                    {areaData.requests.map(request => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onAccept={() => handleAcceptRequest(request.id, request.name)}
                        onDelete={() => handleDeleteRequest(request.id, request.name)}
                        isAccepting={acceptRequestMutation.isPending}
                        isDeleting={deleteRequestMutation.isPending}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Request card component for submitted requests
interface RequestCardProps {
  request: RequestResponse;
  onAccept: () => void;
  onDelete: () => void;
  isAccepting: boolean;
  isDeleting: boolean;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onDelete,
  isAccepting,
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
            <div>Manager: {request.managerName}</div>
            <div>Submitted: {formatDate(request.submittedAt)}</div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Submitted
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => {
              // In a full implementation, this would show the request schedule view
              alert('View functionality would show the request schedule for review');
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
          
          <button
            onClick={onAccept}
            disabled={isAccepting || isDeleting}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {isAccepting ? 'Accepting...' : 'Accept'}
          </button>
          
          <button
            onClick={onDelete}
            disabled={isAccepting || isDeleting}
            className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};