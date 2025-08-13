import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MenuProvider } from '../contexts/MenuContext'
import MenuDropdown from '../components/ui/MenuDropdown'

describe('Menu Switching Behavior', () => {
  const TestMenus = () => (
    <MenuProvider>
      <div>
        <MenuDropdown trigger="People">
          <div>View Schedule...</div>
          <div>New Person...</div>
        </MenuDropdown>
        
        <MenuDropdown trigger="Areas">
          <div>View Areas...</div>
          <div>New Area...</div>
        </MenuDropdown>
        
        <MenuDropdown trigger="Schedules">
          <div>In Progress...</div>
          <div>Published...</div>
        </MenuDropdown>
      </div>
    </MenuProvider>
  )

  it('opens menu on hover', async () => {
    render(<TestMenus />)
    
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.mouseEnter(peopleButton)
    
    await waitFor(() => {
      expect(screen.getByText('View Schedule...')).toBeInTheDocument()
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })
  })

  it('switches between menus instantly on hover', async () => {
    render(<TestMenus />)
    
    // Hover over People menu
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.mouseEnter(peopleButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })
    
    // Hover over Areas menu - should instantly switch
    const areasButton = screen.getByRole('button', { name: /areas/i })
    fireEvent.mouseEnter(areasButton)
    
    // People menu should be gone immediately, Areas menu should be visible
    expect(screen.queryByText('New Person...')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('New Area...')).toBeInTheDocument()
    })
  })

  it('closes menu with delay when mouse leaves completely', async () => {
    render(<TestMenus />)
    
    // Open People menu
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.mouseEnter(peopleButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })
    
    // Mouse leave should start delayed close
    fireEvent.mouseLeave(peopleButton)
    
    // Should still be visible immediately
    expect(screen.getByText('New Person...')).toBeInTheDocument()
    
    // Should be gone after delay (allowing up to 300ms for CI flakiness)
    await waitFor(() => {
      expect(screen.queryByText('New Person...')).not.toBeInTheDocument()
    }, { timeout: 400 })
  })

  it('cancels delayed close when entering another menu', async () => {
    render(<TestMenus />)
    
    // Open People menu
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.mouseEnter(peopleButton)
    
    await waitFor(() => {
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })
    
    // Mouse leave to start delay
    fireEvent.mouseLeave(peopleButton)
    
    // Quickly hover over Areas - should cancel close and switch
    const areasButton = screen.getByRole('button', { name: /areas/i })
    fireEvent.mouseEnter(areasButton)
    
    // Should switch to Areas menu immediately
    expect(screen.queryByText('New Person...')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('New Area...')).toBeInTheDocument()
    })
  })
})