import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MenuProvider } from '../contexts/MenuContext'
import MenuDropdown from '../components/ui/MenuDropdown'
import MenuItem from '../components/ui/MenuItem'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MenuProvider>
      {children}
    </MenuProvider>
  </BrowserRouter>
)

/**
 * Test for the person menu issue that was reported and fixed.
 * 
 * Problem: "New person menu does nothing"
 * Root cause: Event handling conflicts and missing event.stopPropagation()
 * Fix: Added proper event handling in Dropdown and DropdownItem components
 */
describe('Person Menu Fix - Issue Resolution', () => {
  it('person menu dropdown responds to clicks (regression test)', () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <MenuItem onClick={() => console.log('New Person clicked')}>
            New Person...
          </MenuItem>
        </MenuDropdown>
      </TestWrapper>
    )

    // The core issue: clicking the People menu should open the dropdown
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.click(peopleButton)
    
    // Menu should be visible after click
    expect(screen.getByText('New Person...')).toBeInTheDocument()
  })

  it('menu items inside dropdown respond to clicks', () => {
    const mockNewPersonClick = vi.fn()
    
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <MenuItem onClick={mockNewPersonClick}>
            New Person...
          </MenuItem>
        </MenuDropdown>
      </TestWrapper>
    )

    // Open the menu first
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.click(peopleButton)

    const newPersonItem = screen.getByRole('button', { name: /new person/i })
    fireEvent.click(newPersonItem)
    
    // Menu items should respond to clicks
    expect(mockNewPersonClick).toHaveBeenCalledTimes(1)
  })

  it('prevents event bubbling that was causing the issue', () => {
    const mockParentClick = vi.fn()
    
    render(
      <TestWrapper>
        <div onClick={mockParentClick}>
          <MenuDropdown trigger="People">
            <MenuItem onClick={() => {}}>
              New Person...
            </MenuItem>
          </MenuDropdown>
        </div>
      </TestWrapper>
    )

    // Click the dropdown trigger
    fireEvent.click(screen.getByRole('button', { name: /people/i }))
    
    // Parent click should NOT be called (event bubbling prevented)
    expect(mockParentClick).not.toHaveBeenCalled()
  })

  it('dropdown stays open when clicking inside content area', () => {
    const mockItemClick = vi.fn()
    const mockParentClick = vi.fn()
    
    render(
      <TestWrapper>
        <div onClick={mockParentClick}>
          <MenuDropdown trigger="People">
            <MenuItem onClick={mockItemClick}>
              New Person...
            </MenuItem>
          </MenuDropdown>
        </div>
      </TestWrapper>
    )

    // Open the menu first
    const peopleButton = screen.getByRole('button', { name: /people/i })
    fireEvent.click(peopleButton)

    // Click inside the dropdown content
    fireEvent.click(screen.getByRole('button', { name: /new person/i }))
    
    // Item click should work
    expect(mockItemClick).toHaveBeenCalledTimes(1)
    // Parent should NOT be called (event bubbling prevented)
    expect(mockParentClick).not.toHaveBeenCalled()
  })

  it('button type prevents form submission issues', () => {
    render(
      <TestWrapper>
        <form onSubmit={vi.fn()}>
          <MenuDropdown trigger="People">
            <MenuItem onClick={() => {}}>
              New Person...
            </MenuItem>
          </MenuDropdown>
        </form>
      </TestWrapper>
    )

    const peopleButton = screen.getByRole('button', { name: /people/i })
    expect(peopleButton).toHaveAttribute('type', 'button')
    
    // Open menu to test inner button
    fireEvent.click(peopleButton)
    const newPersonButton = screen.getByRole('button', { name: /new person/i })
    expect(newPersonButton).toHaveAttribute('type', 'button')
  })
})