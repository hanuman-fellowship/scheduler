import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { requestService } from '../../services/requestService';
import { CreateRequestInput, BaseScheduleOption } from '@shared/types';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  areaId: number;
  areaName: string;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  areaId,
  areaName
}) => {
  const [requestName, setRequestName] = useState('');
  const [baseType, setBaseType] = useState<'published' | 'template' | 'request' | 'blank'>('published');
  const [selectedBaseId, setSelectedBaseId] = useState<number | undefined>();
  
  const queryClient = useQueryClient();

  // Fetch base schedule options
  const { data: baseOptions, isLoading } = useQuery({
    queryKey: ['request-base-options', areaId],
    queryFn: () => requestService.getBaseOptions(areaId),
    enabled: isOpen
  });

  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: (data: CreateRequestInput) => requestService.createRequest(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['draft-requests'] });
      onClose();
      setRequestName('');
      setSelectedBaseId(undefined);
      alert(`Request "${result.name}" created successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to create request: ${error.response?.data?.error || error.message}`);
    }
  });

  // Update selected base when base type changes
  useEffect(() => {
    if (!baseOptions) return;
    
    switch (baseType) {
      case 'published':
        setSelectedBaseId(baseOptions.published[0]?.id);
        break;
      case 'template':
        setSelectedBaseId(baseOptions.templates[0]?.id);
        break;
      case 'request':
        setSelectedBaseId(baseOptions.previousRequests[0]?.id);
        break;
      case 'blank':
        setSelectedBaseId(undefined);
        break;
    }
  }, [baseType, baseOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestName.trim()) {
      alert('Please enter a request name');
      return;
    }

    const requestData: CreateRequestInput = {
      name: requestName.trim(),
      areaId,
      baseType,
      baseScheduleId: baseType === 'blank' ? undefined : selectedBaseId
    };

    if (baseType !== 'blank' && !selectedBaseId) {
      alert('Please select a base schedule');
      return;
    }

    createRequestMutation.mutate(requestData);
  };

  const getBaseOptions = (): BaseScheduleOption[] => {
    if (!baseOptions) return [];
    
    switch (baseType) {
      case 'published': return baseOptions.published;
      case 'template': return baseOptions.templates;
      case 'request': return baseOptions.previousRequests;
      default: return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">New Request for {areaName}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Request Name */}
          <div>
            <label htmlFor="requestName" className="block text-sm font-medium text-gray-700 mb-1">
              Request Name
            </label>
            <input
              id="requestName"
              type="text"
              value={requestName}
              onChange={(e) => setRequestName(e.target.value)}
              placeholder="e.g., January Session, Without Michael"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={createRequestMutation.isPending}
            />
          </div>

          {/* Base Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start From
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="published"
                  checked={baseType === 'published'}
                  onChange={(e) => setBaseType(e.target.value as typeof baseType)}
                  className="mr-2"
                  disabled={createRequestMutation.isPending}
                />
                <span>Published Schedule (copy current published schedule)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="template"
                  checked={baseType === 'template'}
                  onChange={(e) => setBaseType(e.target.value as typeof baseType)}
                  className="mr-2"
                  disabled={createRequestMutation.isPending}
                />
                <span>Template (copy from saved template)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="request"
                  checked={baseType === 'request'}
                  onChange={(e) => setBaseType(e.target.value as typeof baseType)}
                  className="mr-2"
                  disabled={createRequestMutation.isPending}
                />
                <span>Previous Request (copy from old request)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="blank"
                  checked={baseType === 'blank'}
                  onChange={(e) => setBaseType(e.target.value as typeof baseType)}
                  className="mr-2"
                  disabled={createRequestMutation.isPending}
                />
                <span>Blank (start empty)</span>
              </label>
            </div>
          </div>

          {/* Base Schedule Selection */}
          {baseType !== 'blank' && (
            <div>
              <label htmlFor="baseSchedule" className="block text-sm font-medium text-gray-700 mb-1">
                Select Base Schedule
              </label>
              {isLoading ? (
                <p className="text-gray-500 text-sm">Loading options...</p>
              ) : (
                <select
                  id="baseSchedule"
                  value={selectedBaseId || ''}
                  onChange={(e) => setSelectedBaseId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={createRequestMutation.isPending}
                >
                  <option value="">Select a schedule...</option>
                  {getBaseOptions().map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={createRequestMutation.isPending}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createRequestMutation.isPending || !requestName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createRequestMutation.isPending ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};