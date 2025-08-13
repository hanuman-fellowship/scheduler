import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleManagementService } from '../../services/scheduleManagementService';
import { PublishScheduleInput } from '@shared/types';

interface PublishScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleId: number;
  scheduleName: string;
}

export const PublishScheduleModal: React.FC<PublishScheduleModalProps> = ({
  isOpen,
  onClose,
  scheduleId,
  scheduleName
}) => {
  const [groupName, setGroupName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupType, setGroupType] = useState<'new' | 'existing'>('new');
  const [existingGroupId, setExistingGroupId] = useState<number | ''>('');
  
  const queryClient = useQueryClient();

  // Fetch existing schedule groups
  const { data: scheduleGroups = [] } = useQuery({
    queryKey: ['schedule-groups'],
    queryFn: scheduleManagementService.getScheduleGroups,
    enabled: isOpen
  });

  // Publish schedule mutation
  const publishScheduleMutation = useMutation({
    mutationFn: (data: PublishScheduleInput) => scheduleManagementService.publishSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['schedule-groups'] });
      queryClient.invalidateQueries({ queryKey: ['published-schedule'] });
      onClose();
      resetForm();
      alert(`Schedule "${scheduleName}" published successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to publish schedule: ${error.response?.data?.error || error.message}`);
    }
  });

  const resetForm = () => {
    setGroupName('');
    setStartDate('');
    setEndDate('');
    setGroupType('new');
    setExistingGroupId('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (groupType === 'new' && !groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (groupType === 'existing' && !existingGroupId) {
      alert('Please select an existing group');
      return;
    }

    if (!startDate || !endDate) {
      alert('Please select start and end dates');
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      alert('End date must be after start date');
      return;
    }

    const publishData: PublishScheduleInput = {
      scheduleId,
      groupName: groupType === 'new' ? groupName.trim() : scheduleGroups.find(g => g.id === Number(existingGroupId))?.name || '',
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      groupType,
      existingGroupId: groupType === 'existing' ? Number(existingGroupId) : undefined
    };

    publishScheduleMutation.mutate(publishData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Publish Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Schedule Info */}
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-900">Publishing: {scheduleName}</p>
            <p className="text-xs text-gray-500">This will make the schedule available to personnel and set it as active for the specified date range.</p>
          </div>

          {/* Group Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Group
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="new"
                  checked={groupType === 'new'}
                  onChange={(e) => setGroupType(e.target.value as typeof groupType)}
                  className="mr-2"
                  disabled={publishScheduleMutation.isPending}
                />
                <span>Create new group</span>
              </label>
              
              {scheduleGroups.length > 0 && (
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="existing"
                    checked={groupType === 'existing'}
                    onChange={(e) => setGroupType(e.target.value as typeof groupType)}
                    className="mr-2"
                    disabled={publishScheduleMutation.isPending}
                  />
                  <span>Add to existing group</span>
                </label>
              )}
            </div>
          </div>

          {/* Group Name (for new group) */}
          {groupType === 'new' && (
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Group Name
              </label>
              <input
                id="groupName"
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., January 2024, Spring Session"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={publishScheduleMutation.isPending}
              />
            </div>
          )}

          {/* Existing Group Selection */}
          {groupType === 'existing' && (
            <div>
              <label htmlFor="existingGroup" className="block text-sm font-medium text-gray-700 mb-1">
                Select Group
              </label>
              <select
                id="existingGroup"
                value={existingGroupId}
                onChange={(e) => setExistingGroupId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={publishScheduleMutation.isPending}
              >
                <option value="">Select a group...</option>
                {scheduleGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name} ({new Date(group.start).toLocaleDateString()} - {new Date(group.end).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={publishScheduleMutation.isPending}
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={publishScheduleMutation.isPending}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={publishScheduleMutation.isPending}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={publishScheduleMutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {publishScheduleMutation.isPending ? 'Publishing...' : 'Publish Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};