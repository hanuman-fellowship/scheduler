import React from 'react';
import './LegacySchedule.css';

interface ScheduleHeaderProps {
  title: string;
  subtitle?: string;
  editable: boolean;
  type: 'area' | 'person' | 'gaps';
  totalHours?: number;
  groupName?: string;
  personLastFirst?: string;
  managerName?: string;
  isInProgress?: boolean;
  onEdit?: () => void;
  onTotalHoursClick?: () => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  subtitle,
  editable,
  type,
  totalHours,
  groupName,
  personLastFirst,
  managerName,
  isInProgress = false,
  onEdit,
  onTotalHoursClick
}) => {
  // Create schedule message component
  const renderScheduleMessage = () => {
    if (!groupName && !isInProgress) return null;
    
    return (
      <div>
        <div className="schedule_message">
          <span id="group_name">
            {isInProgress ? 'In Progress' : groupName}
            {!isInProgress && (
              <span className="alert no_print">
                <img src="/img/small_alert_icon.gif" alt="" />
                <span>This schedule is no longer in effect</span>
              </span>
            )}
          </span>
          <span id="published">
            Published on {new Date().toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div style={{ position: 'relative' }}>
          <a 
            href="/" 
            id="published_link" 
            onClick={(e) => e.preventDefault()}
          >
            Published Schedules
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderScheduleMessage()}
      
      <table width={774} border={0} style={{ margin: '0 auto' }} cellPadding={0} cellSpacing={0}>
        <tr>
          <td width={99} rowSpan={2} colSpan={3}>
            <p className="manager-position">
              {type === 'area' ? (
                <>
                  Manager:
                  <span className="title title-padding">
                    {managerName || 'No Manager'}
                  </span>
                </>
              ) : type === 'person' ? (
                <>
                  Total Hours:
                  <span className="title title-padding">
                    {totalHours || 0}
                  </span>
                </>
              ) : (
                'Gaps View'
              )}
            </p>
          </td>
          <td width={222} rowSpan={2}>
            <div style={{ textAlign: 'center' }} className="title">
              <span id="area_name">
                {title}
              </span>
              <br />
              Schedule
            </div>
          </td>
          <td width={107}>
            <div style={{ textAlign: 'right' }}>
              {/* Right content if needed */}
            </div>
          </td>
          <td width={15}>
            &nbsp;
          </td>
          <td width={178}>
            <span style={{ fontSize: '24px' }}>
              {/* Additional content for person schedules */}
            </span>
          </td>
        </tr>
        <tr>
          <td width={200} colSpan={3} style={{ padding: '4px' }}>
            <div style={{ textAlign: 'center' }}>
              {isInProgress ? 'In Progress' : (groupName || '')}
            </div>
          </td>
        </tr>
      </table>
    </>
  );
};