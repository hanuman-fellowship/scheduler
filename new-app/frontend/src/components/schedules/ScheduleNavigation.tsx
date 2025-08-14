import React from 'react';
import './LegacySchedule.css';

interface ScheduleNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  showNavigation?: boolean;
}

export const ScheduleNavigation: React.FC<ScheduleNavigationProps> = ({
  onPrevious,
  onNext,
  showNavigation = true
}) => {
  if (!showNavigation) return null;

  return (
    <table className="navigation-table no_print" cellPadding={0} cellSpacing={0}>
      <tbody>
        <tr>
          <td style={{ width: '50%', textAlign: 'left' }}>
            {onPrevious && (
              <a
                id="previousSchedule"
                className="editable-link"
                onClick={onPrevious}
                title="Previous Schedule (shift+left)"
                style={{ fontSize: '17pt', cursor: 'pointer' }}
              >
                ←
              </a>
            )}
          </td>
          <td style={{ width: '50%', textAlign: 'right' }}>
            {onNext && (
              <a
                id="nextSchedule"
                className="editable-link"
                onClick={onNext}
                title="Next Schedule (shift+right)"
                style={{ fontSize: '17pt', cursor: 'pointer' }}
              >
                →
              </a>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};