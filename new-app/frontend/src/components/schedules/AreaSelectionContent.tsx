import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { scheduleNavigationService, type AreaForSelection } from '../../services/scheduleNavigation';

interface AreaSelectionContentProps {
  onCancel: () => void;
}

export const AreaSelectionContent: React.FC<AreaSelectionContentProps> = ({
  onCancel
}) => {
  const navigate = useNavigate();
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

  const { data: areas = [], isLoading, error } = useQuery({
    queryKey: ['areas-for-selection'],
    queryFn: scheduleNavigationService.getAreasForSelection,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    setLastSelectedId(scheduleNavigationService.getLastSelectedArea());
  }, []);

  const handleAreaSelect = (area: AreaForSelection) => {
    const path = scheduleNavigationService.navigateToAreaSchedule(area.id);
    onCancel(); // Close modal
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent, area: AreaForSelection) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleAreaSelect(area);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg">Loading areas...</div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg text-red-600">
            Error loading areas: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (areas.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg text-gray-500">No areas found</div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 overflow-y-auto">
        <div className="space-y-1">
          {areas.map((area) => {
            const isLastSelected = area.id === lastSelectedId;
            return (
              <button
                key={area.id}
                onClick={() => handleAreaSelect(area)}
                onKeyDown={(e) => handleKeyDown(e, area)}
                className={`
                  block w-full text-left p-2 rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                  ${isLastSelected ? 'bg-blue-50 font-semibold border-l-4 border-blue-500' : ''}
                `}
                title={`View schedule for ${area.name}`}
              >
                <div className="text-blue-600 hover:text-blue-800 transition-colors">
                  {area.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};