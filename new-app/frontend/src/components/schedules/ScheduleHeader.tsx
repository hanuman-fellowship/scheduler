import React from 'react';

interface ScheduleHeaderProps {
  title: string;
  subtitle?: string;
  editable: boolean;
  type: 'area' | 'person' | 'gaps';
  totalHours?: number;
  onEdit?: () => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  subtitle,
  editable,
  type,
  totalHours,
  onEdit
}) => {
  const formatTotalHours = (hours: number) => {
    return `${hours.toFixed(1)} hrs`;
  };

  return (
    <div className="bg-white border-2 border-black p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h1 
              className={`text-xl font-bold ${editable ? 'cursor-pointer hover:text-blue-600' : ''}`}
              onClick={editable ? onEdit : undefined}
            >
              {title}
            </h1>
            {editable && onEdit && (
              <button
                onClick={onEdit}
                className="text-blue-600 hover:text-blue-800 text-sm"
                title="Edit"
              >
                ✏️
              </button>
            )}
          </div>
          
          {subtitle && (
            <div className="text-gray-600 mt-1">
              {type === 'area' ? `Manager: ${subtitle}` : 
               type === 'person' ? `Category: ${subtitle}` : 
               subtitle}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {type === 'person' && totalHours !== undefined && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Hours</div>
              <div className="text-lg font-semibold">{formatTotalHours(totalHours)}</div>
            </div>
          )}
          
          {type === 'area' && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Schedule</div>
              <div className="text-lg font-semibold">Published</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};