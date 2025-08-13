import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useScheduleView } from '../../hooks/useScheduleView';
import { useScheduleStore } from '../../store/scheduleStore';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import { ScheduleTable } from '../schedule/ScheduleTable';
import { ScheduleHeader } from './ScheduleHeader';
import { FloatingShifts } from './FloatingShifts';
import { ScheduleNotes } from './ScheduleNotes';
import type { ScheduleViewMode } from '@shared/types';

export const ScheduleView: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'view' | 'edit' | 'request' | 'print' || 'view';
  const { isEditable, isRequest } = useScheduleStore();
  const { openModal } = useGlobalModal();

  // Determine if we should be in editing mode
  const canEdit = isEditable() || isRequest();
  const editMode = canEdit ? 'edit' : 'view';

  // Validate and construct view mode
  const [viewMode, validationError] = React.useMemo((): [ScheduleViewMode | null, string | null] => {
    if (!type || !id) {
      return [null, 'Invalid schedule view parameters'];
    }

    if (type !== 'area' && type !== 'person' && type !== 'gaps') {
      return [null, `Invalid schedule view type: ${type}`];
    }

    const parsedId = type === 'gaps' ? 'gaps' : parseInt(id, 10);
    if (type !== 'gaps' && (isNaN(parsedId as number) || parsedId <= 0)) {
      return [null, 'Invalid schedule view ID'];
    }

    return [{ type, id: parsedId, mode }, null];
  }, [type, id, mode]);

  if (validationError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading schedule: {validationError}
        </div>
      </div>
    );
  }

  if (!viewMode) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Invalid schedule view</div>
      </div>
    );
  }

  const { data: scheduleData, isLoading, error } = useScheduleView(viewMode);

  // Handle shift creation based on the legacy pattern
  const handleAddShift = React.useCallback((dayId: number, periodName: string) => {
    if (!canEdit || !scheduleData) return;

    // Create shift context based on schedule view type and position
    const shiftContext = {
      dayId,
      periodName,
      scheduleType: viewMode.type,
      scheduleId: viewMode.id,
      areaId: viewMode.type === 'area' ? viewMode.id : undefined,
      personId: viewMode.type === 'person' ? viewMode.id : undefined
    };

    // Open shift modal with context
    openModal('shift', shiftContext);
  }, [canEdit, scheduleData, viewMode, openModal]);

  // Handle floating shift creation
  const handleAddFloatingShift = React.useCallback(() => {
    if (!canEdit || !scheduleData) return;

    const floatingShiftContext = {
      scheduleType: viewMode.type,
      scheduleId: viewMode.id,
      areaId: viewMode.type === 'area' ? viewMode.id : undefined,
      personId: viewMode.type === 'person' ? viewMode.id : undefined,
      floating: true
    };

    openModal('shift', floatingShiftContext);
  }, [canEdit, scheduleData, viewMode, openModal]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">
          Error loading schedule: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">No schedule data found</div>
      </div>
    );
  }

  const renderScheduleContent = () => {
    switch (viewMode.type) {
      case 'area':
        const areaData = scheduleData as any; // Type assertion for now
        return (
          <div className="space-y-4">
            <ScheduleHeader
              title={areaData.area.name}
              subtitle={areaData.area.manager?.username}
              editable={areaData.editable}
              type="area"
            />
            <ScheduleTable
              bounds={areaData.bounds}
              data={areaData}
              editable={canEdit}
              type="area"
              mode={editMode}
              onAddShift={handleAddShift}
              onAddFloatingShift={handleAddFloatingShift}
            />
            {areaData.area.floatingShifts?.length > 0 && (
              <FloatingShifts
                shifts={areaData.area.floatingShifts}
                editable={areaData.editable}
              />
            )}
            {areaData.notes && (
              <ScheduleNotes
                notes={areaData.notes}
                editable={areaData.editable}
              />
            )}
          </div>
        );

      case 'person':
        const personData = scheduleData as any; // Type assertion for now
        return (
          <div className="space-y-4">
            <ScheduleHeader
              title={personData.person.name}
              subtitle={personData.person.category.name}
              editable={personData.editable}
              type="person"
              totalHours={Object.values(personData.totalHours).reduce((sum: number, hours: any) => sum + hours, 0)}
            />
            <ScheduleTable
              bounds={personData.bounds}
              data={personData}
              editable={canEdit}
              type="person"
              mode={editMode}
              onAddShift={handleAddShift}
              onAddFloatingShift={handleAddFloatingShift}
            />
            {(personData.notes.operations.length > 0 || personData.notes.personnel.length > 0) && (
              <div className="space-y-2">
                {personData.notes.operations.length > 0 && (
                  <ScheduleNotes
                    notes={personData.notes.operations.map((n: any) => n.content).join('\n')}
                    editable={personData.editable}
                    type="operations"
                  />
                )}
                {personData.notes.personnel.length > 0 && (
                  <ScheduleNotes
                    notes={personData.notes.personnel.map((n: any) => n.content).join('\n')}
                    editable={false}
                    type="personnel"
                  />
                )}
              </div>
            )}
          </div>
        );

      case 'gaps':
        const gapsData = scheduleData as any; // Type assertion for now
        return (
          <div className="space-y-4">
            <ScheduleHeader
              title="Unassigned Shifts"
              subtitle="Shifts needing coverage"
              editable={false}
              type="gaps"
            />
            <ScheduleTable
              bounds={gapsData.bounds}
              data={gapsData}
              editable={false}
              type="gaps"
              mode={mode}
            />
          </div>
        );

      default:
        return <div>Invalid schedule view type</div>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {renderScheduleContent()}
    </div>
  );
};