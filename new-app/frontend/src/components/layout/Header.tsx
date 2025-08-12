import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { MenuProvider } from '../../contexts/MenuContext'
import MenuDropdown from '../ui/MenuDropdown'
import MenuItem from '../ui/MenuItem'
import DropdownSeparator from '../ui/DropdownSeparator'

export default function Header() {
  const { user, logout, isOperations, isManager, isPersonnel } = useAuthStore()

  return (
    <MenuProvider>
      <div className="no-print">
        <div className="flex items-center space-x-1 text-sm bg-white p-2 border-b">
        <Link to="/" className="font-bold text-lg hover:bg-schedule-hover px-2">
          SCHEDULER!
        </Link>
        
        <span className="text-gray-500">|</span>
        <span className="px-2">Hello, {user?.username}</span>

        {isOperations() && (
          <MenuDropdown trigger="Operations">
            <MenuItem to="/users/add">New User...</MenuItem>
            <MenuItem to="/users/edit">Edit User...</MenuItem>
            <MenuItem to="/users/delete">Delete User...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/users/notes">Notepad</MenuItem>
            <MenuItem to="/manager-notes">Notes for Managers...</MenuItem>
            <MenuItem to="/users/email">Email Users...</MenuItem>
            <DropdownSeparator />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        {isManager() && (
          <MenuDropdown trigger="Manager">
            <MenuItem to="/request/new">New Request...</MenuItem>
            <MenuItem to="/request/view">View Request...</MenuItem>
            <DropdownSeparator />
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        {isPersonnel() && !isOperations() && !isManager() && (
          <MenuDropdown trigger="Personnel">
            <MenuItem onClick={logout}>Logout</MenuItem>
          </MenuDropdown>
        )}

        <span className="text-gray-500">|</span>

        {(isOperations() || isManager()) && (
          <MenuDropdown trigger="Schedules">
            <MenuItem to="/schedule">In Progress...</MenuItem>
            <MenuItem to="/schedule/published">Published...</MenuItem>
            <DropdownSeparator />
            <MenuItem to="/schedule/copy">Edit a Copy...</MenuItem>
            <MenuItem to="/schedule/template">New From Template...</MenuItem>
          </MenuDropdown>
        )}

        {isOperations() && (
          <>
            <span className="text-gray-500">|</span>
            <MenuDropdown trigger="People">
              <MenuItem to="/people">View Schedule...</MenuItem>
              <MenuItem to="/board">Big Board</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/people/add">New Person...</MenuItem>
            </MenuDropdown>

            <MenuDropdown trigger="Areas">
              <MenuItem to="/areas">View Schedule...</MenuItem>
              <DropdownSeparator />
              <MenuItem to="/areas/add">New Area...</MenuItem>
            </MenuDropdown>
          </>
        )}
        </div>
      </div>
    </MenuProvider>
  )
}