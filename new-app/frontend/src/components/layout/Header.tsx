import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useDropdown } from '../../hooks/useDropdown'
import Dropdown from '../ui/Dropdown'
import DropdownItem from '../ui/DropdownItem'
import DropdownSeparator from '../ui/DropdownSeparator'

export default function Header() {
  const { user, logout, isOperations, isManager, isPersonnel } = useAuthStore()
  const { isOpen, toggleDropdown, closeDropdown } = useDropdown()

  return (
    <div className="no-print">
      <div className="flex items-center space-x-1 text-sm bg-white p-2 border-b">
        <Link to="/" className="font-bold text-lg hover:bg-schedule-hover px-2">
          SCHEDULER!
        </Link>
        
        <span className="text-gray-500">|</span>
        <span className="px-2">Hello, {user?.username}</span>

        {isOperations() && (
          <Dropdown 
            trigger="Operations"
            isOpen={isOpen('operations')}
            onToggle={() => toggleDropdown('operations')}
          >
            <DropdownItem to="/users/add">New User...</DropdownItem>
            <DropdownItem to="/users/edit">Edit User...</DropdownItem>
            <DropdownItem to="/users/delete">Delete User...</DropdownItem>
            <DropdownSeparator />
            <DropdownItem to="/users/notes">Notepad</DropdownItem>
            <DropdownItem to="/manager-notes">Notes for Managers...</DropdownItem>
            <DropdownItem to="/users/email">Email Users...</DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={logout}>Logout</DropdownItem>
          </Dropdown>
        )}

        {isManager() && (
          <Dropdown 
            trigger="Manager"
            isOpen={isOpen('manager')}
            onToggle={() => toggleDropdown('manager')}
          >
            <DropdownItem to="/request/new">New Request...</DropdownItem>
            <DropdownItem to="/request/view">View Request...</DropdownItem>
            <DropdownSeparator />
            <DropdownItem onClick={logout}>Logout</DropdownItem>
          </Dropdown>
        )}

        {isPersonnel() && !isOperations() && !isManager() && (
          <Dropdown 
            trigger="Personnel"
            isOpen={isOpen('personnel')}
            onToggle={() => toggleDropdown('personnel')}
          >
            <DropdownItem onClick={logout}>Logout</DropdownItem>
          </Dropdown>
        )}

        <span className="text-gray-500">|</span>

        {(isOperations() || isManager()) && (
          <Dropdown 
            trigger="Schedules"
            isOpen={isOpen('schedules')}
            onToggle={() => toggleDropdown('schedules')}
          >
            <DropdownItem to="/schedule">In Progress...</DropdownItem>
            <DropdownItem to="/schedule/published">Published...</DropdownItem>
            <DropdownSeparator />
            <DropdownItem to="/schedule/copy">Edit a Copy...</DropdownItem>
            <DropdownItem to="/schedule/template">New From Template...</DropdownItem>
          </Dropdown>
        )}

        {isOperations() && (
          <>
            <span className="text-gray-500">|</span>
            <Dropdown 
              trigger="People"
              isOpen={isOpen('people')}
              onToggle={() => toggleDropdown('people')}
            >
              <DropdownItem to="/people">View Schedule...</DropdownItem>
              <DropdownItem to="/board">Big Board</DropdownItem>
              <DropdownSeparator />
              <DropdownItem to="/people/add">New Person...</DropdownItem>
            </Dropdown>

            <Dropdown 
              trigger="Areas"
              isOpen={isOpen('areas')}
              onToggle={() => toggleDropdown('areas')}
            >
              <DropdownItem to="/areas">View Schedule...</DropdownItem>
              <DropdownSeparator />
              <DropdownItem to="/areas/add">New Area...</DropdownItem>
            </Dropdown>
          </>
        )}
      </div>

      {/* Backdrop to close dropdown */}
      {isOpen('operations') || isOpen('manager') || isOpen('personnel') || 
       isOpen('schedules') || isOpen('people') || isOpen('areas') ? (
        <div className="fixed inset-0 z-40" onClick={closeDropdown} />
      ) : null}
    </div>
  )
}