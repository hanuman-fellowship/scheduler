import React, { ReactNode, useRef, useCallback, useMemo } from 'react'
import { useMenuContext } from '../../contexts/MenuContext'

interface MenuDropdownProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
}

export default function MenuDropdown({ trigger, children, className = '' }: MenuDropdownProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { activeMenu, openMenu, closeMenu, closeMenuDelayed, clearDelayedClose } = useMenuContext()
  
  // Generate unique ID for this menu
  const menuId = useMemo(() => Math.random().toString(36).substr(2, 9), [])
  
  const isOpen = activeMenu === menuId

  const handleMouseEnter = useCallback(() => {
    clearDelayedClose()
    openMenu(menuId)
  }, [menuId, openMenu, clearDelayedClose])

  const handleMouseLeave = useCallback(() => {
    closeMenuDelayed()
  }, [closeMenuDelayed])

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOpen) {
      closeMenu()
    } else {
      openMenu(menuId)
    }
  }, [isOpen, menuId, openMenu, closeMenu])

  // Close dropdown when clicking outside
  const handleDocumentClick = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      closeMenu()
    }
  }, [closeMenu])

  // Add document click listener when open
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleDocumentClick)
      return () => document.removeEventListener('click', handleDocumentClick)
    }
  }, [isOpen, handleDocumentClick])

  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="menu-item" 
        onClick={handleClick}
        type="button"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-full left-0 bg-white border border-gray-300 shadow-lg z-50 min-w-48"
          onClick={(e) => e.stopPropagation()}
        >
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, { 
                closeMenu: closeMenu 
              } as any)
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}