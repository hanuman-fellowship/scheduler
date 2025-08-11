import { ReactNode } from 'react'

interface DropdownProps {
  trigger: ReactNode
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}

export default function Dropdown({ trigger, isOpen, onToggle, children }: DropdownProps) {
  return (
    <div className="relative">
      <button className="menu-item" onClick={onToggle}>
        {trigger}
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 bg-white border border-gray-300 shadow-lg z-50 min-w-48">
          {children}
        </div>
      )}
    </div>
  )
}