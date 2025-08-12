import React, { createContext, useContext, useState, useRef, ReactNode } from 'react'

interface MenuContextType {
  activeMenu: string | null
  openMenu: (menuId: string) => void
  closeMenu: () => void
  closeMenuDelayed: () => void
  clearDelayedClose: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

interface MenuProviderProps {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout>()

  const openMenu = (menuId: string) => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
    
    // If a different menu is already open, switch immediately
    if (activeMenu !== menuId) {
      setActiveMenu(menuId)
    }
  }

  const closeMenu = () => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
    setActiveMenu(null)
  }

  const closeMenuDelayed = () => {
    // Only set timeout if no timeout is already pending
    if (!closeTimeoutRef.current) {
      closeTimeoutRef.current = setTimeout(() => {
        setActiveMenu(null)
        closeTimeoutRef.current = undefined
      }, 150)
    }
  }

  const clearDelayedClose = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = undefined
    }
  }

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  return (
    <MenuContext.Provider 
      value={{ 
        activeMenu, 
        openMenu, 
        closeMenu, 
        closeMenuDelayed, 
        clearDelayedClose 
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenuContext() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenuContext must be used within a MenuProvider')
  }
  return context
}