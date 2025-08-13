import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleManagementService } from '../../services/scheduleManagementService';
import { schedulesService } from '../../services/schedules';
import { CopyScheduleInput } from '@shared/types';

interface CopyScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopyScheduleModal: React.FC<CopyScheduleModalProps> = ({
  isOpen,
  onClose
}) => {
  const [scheduleName, setScheduleName] = useState('');
  const [sourceScheduleId, setSourceScheduleId] = useState<number | ''>('');
  const [copyType, setCopyType] = useState<'full' | 'structure' | 'template'>('full');
  
  const queryClient = useQueryClient();

  // Fetch available schedules to copy from
  const { data: schedulesData } = useQuery({
    queryKey: ['schedules'],
    queryFn: schedulesService.getSchedules,
    enabled: isOpen
  });

  // Fetch templates
  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: scheduleManagementService.getTemplates,
    enabled: isOpen
  });

  // Copy schedule mutation
  const copyScheduleMutation = useMutation({
    mutationFn: (data: CopyScheduleInput) => scheduleManagementService.copySchedule(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      onClose();
      setScheduleName('');
      setSourceScheduleId('');
      alert(`Schedule "${result.name}" created successfully!`);
    },
    onError: (error: any) => {
      alert(`Failed to copy schedule: ${error.response?.data?.error || error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduleName.trim()) {
      alert('Please enter a schedule name');
      return;
    }

    if (!sourceScheduleId) {
      alert('Please select a source schedule');
      return;
    }

    const copyData: CopyScheduleInput = {
      name: scheduleName.trim(),
      sourceId: Number(sourceScheduleId),
      copyType
    };

    copyScheduleMutation.mutate(copyData);
  };

  if (!isOpen) return null;

  const allSchedules = schedulesData?.mine || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Copy Schedule</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Schedule Name */}
          <div>
            <label htmlFor="scheduleName" className="block text-sm font-medium text-gray-700 mb-1">
              New Schedule Name
            </label>
            <input
              id="scheduleName"
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              placeholder="e.g., March Schedule"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={copyScheduleMutation.isPending}
            />
          </div>

          {/* Source Schedule */}
          <div>
            <label htmlFor="sourceSchedule" className="block text-sm font-medium text-gray-700 mb-1">
              Source Schedule
            </label>
            <select
              id="sourceSchedule"
              value={sourceScheduleId}
              onChange={(e) => setSourceScheduleId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={copyScheduleMutation.isPending}
            >
              <option value="">Select a schedule...</option>
              <optgroup label="My Schedules">
                {allSchedules.filter((s: any) => !s.template).map((schedule: any) => (
                  <option key={`schedule-${schedule.id}`} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </optgroup>
              {templates.length > 0 && (
                <optgroup label="Templates">
                  {templates.map(template => (
                    <option key={`template-${template.id}`} value={template.id}>
                      {template.name} (Template)
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Copy Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Copy Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="full"
                  checked={copyType === 'full'}
                  onChange={(e) => setCopyType(e.target.value as typeof copyType)}
                  className="mr-2"
                  disabled={copyScheduleMutation.isPending}
                />
                <span>Full Copy (includes shifts, assignments, and people)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="template"
                  checked={copyType === 'template'}
                  onChange={(e) => setCopyType(e.target.value as typeof copyType)}
                  className="mr-2"
                  disabled={copyScheduleMutation.isPending}
                />
                <span>Template Copy (structure + current people)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="structure"
                  checked={copyType === 'structure'}
                  onChange={(e) => setCopyType(e.target.value as typeof copyType)}
                  className="mr-2"
                  disabled={copyScheduleMutation.isPending}
                />
                <span>Structure Only (areas, days, categories)</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={copyScheduleMutation.isPending}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={copyScheduleMutation.isPending || !scheduleName.trim() || !sourceScheduleId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copyScheduleMutation.isPending ? 'Copying...' : 'Copy Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};