import React from 'react';

interface ScheduleHeaderProps {
  title: string;
  subtitle?: string;
  editable: boolean;
  type: 'area' | 'person' | 'gaps';
  totalHours?: number;
  groupName?: string;
  personLastFirst?: string;
  onEdit?: () => void;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  subtitle,
  editable,
  type,
  totalHours,
  groupName,
  personLastFirst,
  onEdit
}) => {
  return (
    <div className="flex justify-center mb-0">
      <table 
        width={774} 
        border={0} 
        cellPadding={0} 
        cellSpacing={0}
        style={{ borderCollapse: 'separate' }}
      >
        <tbody>
          <tr> 
            <td width={99} rowSpan={2} colSpan={3} style={{ verticalAlign: 'top' }}> 
              <p style={{ position: 'relative', top: '-10px', left: '20px' }}>
                {type === 'area' ? 'Manager: ' : (
                  <span 
                    id="total_hours" 
                    title="Display Hour Breakdown... (ctrl+h)" 
                    style={{ textDecoration: 'none', cursor: 'pointer' }}
                    role="button"
                    tabIndex={0}
                  >
                    Total Hours:
                  </span>
                )}
                <span 
                  className="title" 
                  style={{ 
                    paddingLeft: '3px', 
                    position: 'relative', 
                    top: '3px',
                    fontWeight: 'bold' 
                  }}
                >
                  {type === 'area' ? subtitle : (totalHours || '')}
                </span>
              </p>
            </td> 
            <td width={222} rowSpan={2} style={{ verticalAlign: 'top' }}> 
              <div style={{ textAlign: 'center' }} className="title"> 
                <span 
                  id={type === 'area' ? 'area_name' : 'category_name'}
                  style={{ 
                    cursor: editable ? 'pointer' : 'default',
                    fontWeight: 'bold'
                  }}
                  onClick={editable ? onEdit : undefined}
                  title={editable ? 'Edit...' : ''}
                >
                  {type === 'person' ? subtitle : title}
                </span>
                <br />
                Schedule
              </div>
            </td> 
            <td width={107} style={{ verticalAlign: 'top' }}>
              <div style={{ textAlign: 'right' }}>
                {type === 'person' ? 'Name:' : ''}
              </div>
            </td> 
            <td width={15} style={{ verticalAlign: 'top' }}>
              &nbsp;
            </td> 
            <td width={178} style={{ verticalAlign: 'top' }}>
              <span style={{ fontSize: '24px' }}> 
                {type === 'person' && (
                  <>
                    <span 
                      id="person_name"
                      style={{ 
                        cursor: editable ? 'pointer' : 'default',
                        fontWeight: 'bold'
                      }}
                      onClick={editable ? onEdit : undefined}
                      title={editable ? 'Edit Person...' : 'View Profile'}
                    >
                      {title}
                    </span>
                    <br />
                    <span id="full_name">{personLastFirst}</span>
                  </>
                )}
              </span>
            </td> 
          </tr> 
          <tr> 
            <td width={200} colSpan={3} style={{ padding: '4px', verticalAlign: 'top' }}> 
              <div style={{ textAlign: 'center' }}>
                {groupName || ''}
              </div>
            </td> 
          </tr> 
        </tbody>
      </table>
    </div>
  );
};