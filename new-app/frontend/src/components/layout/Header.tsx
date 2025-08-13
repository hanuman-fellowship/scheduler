import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { MenuProvider } from '../../contexts/MenuContext'
import { useGlobalModal } from '../../contexts/GlobalModalContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import MenuDropdown from '../ui/MenuDropdown'
import MenuItem from '../ui/MenuItem'
import DropdownSeparator from '../ui/DropdownSeparator'

export default function Header() {
  const { user, logout, isOperations, isManager, isPersonnel } = useAuthStore()
  const { openModal, openAreaSelectionModal, openPersonSelectionModal } = useGlobalModal()

  // Set up keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'p',
      ctrlKey: true,
      callback: () => {
        if (isOperations()) {
          openPersonSelectionModal();
        }
      }
    },
    {
      key: 'a',
      ctrlKey: true,
      callback: () => {
        if (isOperations()) {
          openAreaSelectionModal();
        }
      }
    }
  ]);

  return (
    <MenuProvider>
      <div className="no-print">
        <div className="flex items-center justify-between text-sm bg-white p-2 border-b">
          {/* Main Menu Section */}
          <div className="flex items-center space-x-1">
            <Link to="/" className="font-bold text-lg hover:bg-schedule-hover px-2">
              SCHEDULER!
            </Link>
            
            <span className="text-gray-500">|</span>
            <span className="px-2">Hello, {user?.username}</span>

        {isOperations() && (
          <MenuDropdown trigger="Operations">
            <MenuItem to="/users">Manage Users...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/users/notes">Notepad</MenuItem>
            <MenuItem to="/manager-notes">Notes for Managers...</MenuItem>
            <MenuItem to="/users/email">Email Users...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/schedules/view-request">View Request...</MenuItem>
            <MenuItem to="/schedules/delete-requests">Delete Requests...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/email-settings/operations">Operations Email Settings...</MenuItem>
            <MenuItem to="/email-settings/scheduler">Scheduler Email Settings...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/users/change-password">Change Password...</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        {isManager() && (
          <MenuDropdown trigger="Manager">
            <MenuItem to="/requests/in-progress">Requests In Progress...</MenuItem>
            <MenuItem to="/requests/delete-unfinished">Delete Unfinished Request...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/request/new">New Request...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/requests/view-submitted">View Submitted Request...</MenuItem>
            <MenuItem to="/manager-notes/view">View Notes from Operations...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/users/change-password">Change Password...</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        {isPersonnel() && !isOperations() && !isManager() && (
          <MenuDropdown trigger="Personnel">
            <MenuItem to="/users/change-password">Change Password...</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        <span className="text-gray-500">|</span>

        {(isOperations() || isManager()) && (
          <MenuDropdown trigger="Schedules">
            <MenuItem to="/schedule">In Progress...</MenuItem>
            <MenuItem to="/schedule/published">Published...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/schedule-view/gaps/gaps">View Gaps</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/days/edit">Edit Days...</MenuItem>
            <MenuItem to="/boundaries/edit">Edit Times...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/schedule/copy">Edit a Copy...</MenuItem>
            <MenuItem to="/schedule/delete">Delete...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/schedule/template">New From Template...</MenuItem>
            <MenuItem to="/schedule/save-template">Save as Template...</MenuItem>
            <MenuItem to="/schedule/delete-template">Delete Template...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/settings/toggle-dates">Show/Hide Dates</MenuItem>
          </MenuDropdown>
        )}

        {isOperations() && (
          <>
            <span className="text-gray-500">|</span>
            <MenuDropdown trigger="People">
              <MenuItem onClick={openPersonSelectionModal} shortcut="Ctrl+P">View Schedule...</MenuItem>
              <MenuItem to="/board">Big Board</MenuItem>
              <DropdownSeparator />
              <MenuItem onClick={() => openModal('person')}>New Person...</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/people/restore">Restore Person...</MenuItem>
              <MenuItem to="/people/retire">Retire Person...</MenuItem>
              <DropdownSeparator />
              <MenuItem onClick={() => openModal('category')}>New Category...</MenuItem>
              <MenuItem to="/categories/edit">Edit Category...</MenuItem>
              <MenuItem to="/categories/reorder">Reorder Categories...</MenuItem>
              <MenuItem to="/categories/delete">Delete Category...</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/people/affected-schedules">Affected Schedules...</MenuItem>
              <MenuItem to="/people/print">Print People...</MenuItem>
            </MenuDropdown>

            <MenuDropdown trigger="Areas">
              <MenuItem onClick={openAreaSelectionModal} shortcut="Ctrl+A">View Schedule...</MenuItem>
              <DropdownSeparator />
              <MenuItem onClick={() => openModal('area')}>New Area...</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/areas/clear">Clear Area...</MenuItem>
              <MenuItem to="/areas/delete">Delete Area...</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/areas/affected-schedules">Affected Schedules...</MenuItem>
              <MenuItem to="/areas/print">Print Areas...</MenuItem>
            </MenuDropdown>

            <MenuDropdown trigger="Shifts">
              <MenuItem onClick={() => openModal('shift')}>New Shift...</MenuItem>
              <MenuItem to="/floating-shifts/add">New Floating Shift...</MenuItem>
              <MenuItem to="/constant-shifts/add">New Constant Shift...</MenuItem>
            </MenuDropdown>
          </>
        )}
          </div>

          {/* Changes Section - Right Side */}
          {isOperations() && (
            <div className="flex items-center space-x-3 text-xs font-bold">
              <span className="text-gray-400 cursor-not-allowed px-2" title="Redo feature not yet implemented (ctrl+r)">
                Redo
              </span>
              <span className="text-gray-400 cursor-not-allowed px-2" title="Undo feature not yet implemented (ctrl+u)">
                Undo
              </span>
              <button 
                className="text-blue-600 hover:text-blue-800 hover:underline px-2" 
                title="View changes history (stub)"
              >
                View All Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </MenuProvider>
  )
}