import { useState } from 'react'

export function useDropdown() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const toggleDropdown = (menuName: string) => {
    setActiveDropdown(activeDropdown === menuName ? null : menuName)
  }

  const closeDropdown = () => setActiveDropdown(null)

  const isOpen = (menuName: string) => activeDropdown === menuName

  return {
    activeDropdown,
    toggleDropdown,
    closeDropdown,
    isOpen,
  }
}