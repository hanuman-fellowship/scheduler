import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface DropdownItemProps {
  children: ReactNode
  to?: string
  onClick?: () => void
}

export default function DropdownItem({ children, to, onClick }: DropdownItemProps) {
  const className = "block w-full text-left px-4 py-2 hover:bg-schedule-hover"

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}