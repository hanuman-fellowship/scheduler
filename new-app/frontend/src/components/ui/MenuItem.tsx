import { Link, useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface MenuItemProps {
  children: ReactNode
  to?: string
  onClick?: () => void
  closeMenu?: () => void
}

export default function MenuItem({ children, to, onClick, closeMenu }: MenuItemProps) {
  const navigate = useNavigate()
  const className = "block w-full text-left px-4 py-2 hover:bg-schedule-hover"

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Close the menu first
    if (closeMenu) {
      closeMenu()
    }
    
    if (onClick) {
      onClick()
    } else if (to) {
      // Use navigate for programmatic navigation
      navigate(to)
    }
  }

  if (to) {
    return (
      <button onClick={handleClick} className={className} type="button">
        {children}
      </button>
    )
  }

  return (
    <button onClick={handleClick} className={className} type="button">
      {children}
    </button>
  )
}