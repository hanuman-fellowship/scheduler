import React, { useState } from 'react';

interface ScheduleNotesProps {
  notes: string;
  editable: boolean;
  type?: 'operations' | 'personnel' | 'manager';
  onEdit?: (notes: string) => void;
}

export const ScheduleNotes: React.FC<ScheduleNotesProps> = ({
  notes,
  editable,
  type = 'manager',
  onEdit
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    onEdit?.(editedNotes);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedNotes(notes);
    setIsEditing(false);
  };

  const getTypeDisplay = () => {
    switch (type) {
      case 'operations':
        return 'Operations Notes';
      case 'personnel':
        return 'Personnel Notes';
      case 'manager':
      default:
        return 'Notes';
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'operations':
        return 'bg-blue-50 border-blue-300';
      case 'personnel':
        return 'bg-green-50 border-green-300';
      case 'manager':
      default:
        return 'bg-gray-50 border-gray-300';
    }
  };

  if (!notes && !editable) {
    return null;
  }

  return (
    <div className={`border-2 border-black p-4 ${getTypeStyles()}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{getTypeDisplay()}</h3>
        {editable && !isEditing && onEdit && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            Edit Notes
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter notes..."
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="whitespace-pre-wrap">
          {notes || (
            <span className="text-gray-500 italic">
              {editable ? 'Click "Edit Notes" to add notes' : 'No notes'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};