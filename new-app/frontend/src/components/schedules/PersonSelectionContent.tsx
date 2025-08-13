import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { scheduleNavigationService, type PersonForSelection } from '../../services/scheduleNavigation';

interface PersonSelectionContentProps {
  onCancel: () => void;
}

export const PersonSelectionContent: React.FC<PersonSelectionContentProps> = ({
  onCancel
}) => {
  const navigate = useNavigate();
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);

  const { data: peopleByCategory = {}, isLoading, error } = useQuery({
    queryKey: ['people-for-selection'],
    queryFn: scheduleNavigationService.getPeopleForSelection,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    setLastSelectedId(scheduleNavigationService.getLastSelectedPerson());
  }, []);

  const handlePersonSelect = (person: PersonForSelection) => {
    const path = scheduleNavigationService.navigateToPersonSchedule(person.id);
    onCancel(); // Close modal
    navigate(path);
  };

  const handleKeyDown = (event: React.KeyboardEvent, person: PersonForSelection) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlePersonSelect(person);
    }
  };

  const categoryNames = Object.keys(peopleByCategory);
  const hasNoPeople = categoryNames.length === 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg">Loading people...</div>
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
            Error loading people: {error instanceof Error ? error.message : 'Unknown error'}
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

  if (hasNoPeople) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="text-lg text-gray-500">No people found</div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryNames.map((categoryName) => {
            const people = peopleByCategory[categoryName];
            const categoryColor = people[0]?.category.color || '#333';

            return (
              <div 
                key={categoryName} 
                className="min-h-0" 
                style={{ padding: '10px' }}
              >
                <div className="font-bold mb-3 text-base">
                  {categoryName}
                </div>
                
                <div className="space-y-1">
                  {people.map((person) => {
                    const isLastSelected = person.id === lastSelectedId;
                    return (
                      <button
                        key={person.id}
                        onClick={() => handlePersonSelect(person)}
                        onKeyDown={(e) => handleKeyDown(e, person)}
                        className={`
                          block w-full text-left p-1 rounded hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition-colors
                          ${isLastSelected ? 'bg-blue-50 font-semibold border-l-4 border-blue-500' : ''}
                        `}
                        title={`View schedule for ${person.name}`}
                      >
                        <div 
                          style={{ color: categoryColor }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {person.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
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