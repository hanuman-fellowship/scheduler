import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface BoxyButtonProps {
  children: ReactNode
  to?: string
  onClick?: () => void
}

export default function BoxyButton({ children, to, onClick }: BoxyButtonProps) {
  const className = "boxy-button"

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