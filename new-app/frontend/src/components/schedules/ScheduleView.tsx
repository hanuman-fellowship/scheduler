import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useScheduleView } from '../../hooks/useScheduleView';
import { useScheduleStore } from '../../store/scheduleStore';
import { useGlobalModal } from '../../contexts/GlobalModalContext';
import { ScheduleGrid } from './ScheduleGrid';
import { ScheduleHeader } from './ScheduleHeader';
import { FloatingShifts } from './FloatingShifts';
import { ScheduleNotes } from './ScheduleNotes';
import { ScheduleNavigation } from './ScheduleNavigation';
import type { ScheduleViewMode, AreaScheduleResponse, PersonScheduleResponse, GapsScheduleResponse } from '@shared/types';

export const ScheduleView: React.FC = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') as 'view' | 'edit' | 'request' | 'print' || 'view';
  const { isEditable, isRequest } = useScheduleStore();
  const { openModal } = useGlobalModal();

  // Determine if we should be in editing mode
  const canEdit = isEditable() || isRequest();

  // Validate and construct view mode
  const [viewMode, validationError] = React.useMemo((): [ScheduleViewMode | null, string | null] => {
    if (!type || !id) {
      return [null, 'Invalid schedule view parameters'];
    }

    if (type !== 'area' && type !== 'person' && type !== 'gaps') {
      return [null, `Invalid schedule view type: ${type}`];
    }

    const parsedId = type === 'gaps' ? 'gaps' : parseInt(id, 10);
    if (type !== 'gaps' && (isNaN(parsedId as number) || (parsedId as number) <= 0)) {
      return [null, 'Invalid schedule view ID'];
    }

    return [{ type, id: parsedId, mode }, null];
  }, [type, id, mode]);

  // IMPORTANT: Always call useScheduleView hook, even if viewMode is null
  // This prevents "Rendered more hooks than during the previous render" error
  const { 
    data: scheduleData, 
    isLoading, 
    error 
  } = useScheduleView(viewMode || { type: 'area', id: 1, mode: 'view' });

  // Handle shift creation based on the legacy pattern
  const handleAddShift = React.useCallback((dayId: number, periodName: string) => {
    if (!canEdit || !scheduleData || !viewMode) return;

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
    if (!canEdit || !scheduleData || !viewMode) return;

    const floatingShiftContext = {
      scheduleType: viewMode.type,
      scheduleId: viewMode.id,
      areaId: viewMode.type === 'area' ? viewMode.id : undefined,
      personId: viewMode.type === 'person' ? viewMode.id : undefined,
      floating: true
    };

    openModal('shift', floatingShiftContext);
  }, [canEdit, scheduleData, viewMode, openModal]);

  // Handle shift editing - click on time to edit
  const handleShiftClick = React.useCallback((shiftId: number) => {
    if (!canEdit) return;

    // Open edit shift modal with shift ID
    openModal('editShift', { shiftId });
  }, [canEdit, openModal]);

  // Handle navigation
  const handlePreviousSchedule = React.useCallback(() => {
    // TODO: Implement navigation to previous schedule
    console.log('Navigate to previous schedule');
  }, []);

  const handleNextSchedule = React.useCallback(() => {
    // TODO: Implement navigation to next schedule
    console.log('Navigate to next schedule');
  }, []);

  // Now handle the conditional rendering after all hooks are called
  if (validationError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ fontSize: '18px', color: '#dc2626' }}>
          Error loading schedule: {validationError}
        </div>
      </div>
    );
  }

  if (!viewMode) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ fontSize: '18px' }}>Invalid schedule view</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ fontSize: '18px' }}>Loading schedule...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ fontSize: '18px', color: '#dc2626' }}>
          Error loading schedule: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      </div>
    );
  }

  if (!scheduleData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
        <div style={{ fontSize: '18px' }}>No schedule data found</div>
      </div>
    );
  }

  const renderScheduleContent = () => {
    switch (viewMode.type) {
      case 'area':
        const areaData = scheduleData as AreaScheduleResponse;
        return (
          <div style={{ margin: 0 }}>
            <ScheduleHeader
              title={areaData.area.name}
              subtitle={areaData.area.manager?.username || 'No Manager'}
              managerName={areaData.area.manager?.username}
              editable={areaData.editable}
              type="area"
              groupName={(areaData as any).groupName}
              isInProgress={!(areaData as any).groupName}
            />
            <ScheduleGrid
              bounds={areaData.bounds}
              data={areaData}
              editable={canEdit}
              type="area"
              isRequestMode={isRequest()}
              onShiftClick={handleShiftClick}
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
        const personData = scheduleData as PersonScheduleResponse;
        return (
          <div style={{ margin: 0 }}>
            <ScheduleHeader
              title={personData.person.name}
              subtitle={personData.person.category?.name}
              editable={personData.editable}
              type="person"
              totalHours={(personData as any).totalHours ? Object.values((personData as any).totalHours).reduce((sum: number, hours: any) => sum + hours, 0) : 0}
              groupName={(personData as any).groupName}
              personLastFirst={`${(personData.person as any).lastName || (personData.person as any).last || ''}, ${(personData.person as any).firstName || (personData.person as any).first || ''}`}
              isInProgress={!(personData as any).groupName}
            />
            <ScheduleGrid
              bounds={personData.bounds}
              data={personData}
              editable={canEdit}
              type="person"
              isRequestMode={isRequest()}
              onShiftClick={handleShiftClick}
              onAddShift={handleAddShift}
              onAddFloatingShift={handleAddFloatingShift}
            />
            {(personData.notes.operations.length > 0 || personData.notes.personnel.length > 0) && (
              <div style={{ marginTop: '8px' }}>
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
        const gapsData = scheduleData as GapsScheduleResponse;
        return (
          <div style={{ margin: 0 }}>
            <ScheduleHeader
              title="Unassigned Shifts"
              subtitle="Shifts needing coverage"
              editable={false}
              type="gaps"
              groupName={(gapsData as any).groupName}
              isInProgress={!(gapsData as any).groupName}
            />
            <ScheduleGrid
              bounds={gapsData.bounds}
              data={gapsData}
              editable={true}
              type="gaps"
              isRequestMode={false}
              onShiftClick={handleShiftClick}
            />
          </div>
        );

      default:
        return <div>Invalid schedule view type</div>;
    }
  };

  const showNavigation = mode !== 'request' && mode !== 'print' && viewMode.type !== 'gaps';

  return (
    <div style={{ width: '100%' }}>
      {renderScheduleContent()}
      {showNavigation && (
        <ScheduleNavigation
          onPrevious={handlePreviousSchedule}
          onNext={handleNextSchedule}
          showNavigation={showNavigation}
        />
      )}
    </div>
  );
};