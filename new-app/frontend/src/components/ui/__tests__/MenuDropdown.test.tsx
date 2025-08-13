import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { MenuProvider } from '../../../contexts/MenuContext'
import MenuDropdown from '../MenuDropdown'
import DropdownSeparator from '../DropdownSeparator'

// Test wrapper with required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <MenuProvider>
      {children}
    </MenuProvider>
  </BrowserRouter>
)

describe('MenuDropdown Component', () => {
  it('renders trigger button correctly', () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <div>Test Content</div>
        </MenuDropdown>
      </TestWrapper>
    )

    expect(screen.getByRole('button', { name: /people/i })).toBeInTheDocument()
  })

  it('shows menu content on hover', async () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <div>View Schedule...</div>
          <div>New Person...</div>
        </MenuDropdown>
      </TestWrapper>
    )

    const trigger = screen.getByRole('button', { name: /people/i })
    fireEvent.mouseEnter(trigger)

    await waitFor(() => {
      expect(screen.getByText('View Schedule...')).toBeInTheDocument()
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })
  })

  it('hides menu content with delay on mouse leave', async () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <div>View Schedule...</div>
        </MenuDropdown>
      </TestWrapper>
    )

    const trigger = screen.getByRole('button', { name: /people/i })
    
    // Open menu
    fireEvent.mouseEnter(trigger)
    await waitFor(() => {
      expect(screen.getByText('View Schedule...')).toBeInTheDocument()
    })

    // Leave menu
    fireEvent.mouseLeave(trigger)
    
    // Should still be visible immediately
    expect(screen.getByText('View Schedule...')).toBeInTheDocument()

    // Should be hidden after delay
    await waitFor(() => {
      expect(screen.queryByText('View Schedule...')).not.toBeInTheDocument()
    }, { timeout: 200 })
  })

  it('switches between menus instantly', async () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <div>New Person...</div>
        </MenuDropdown>
        <MenuDropdown trigger="Areas">
          <div>New Area...</div>
        </MenuDropdown>
      </TestWrapper>
    )

    const peopleTrigger = screen.getByRole('button', { name: /people/i })
    const areasTrigger = screen.getByRole('button', { name: /areas/i })

    // Open People menu
    fireEvent.mouseEnter(peopleTrigger)
    await waitFor(() => {
      expect(screen.getByText('New Person...')).toBeInTheDocument()
    })

    // Switch to Areas menu instantly
    fireEvent.mouseEnter(areasTrigger)
    
    // People menu should be gone immediately
    expect(screen.queryByText('New Person...')).not.toBeInTheDocument()
    
    // Areas menu should be visible
    await waitFor(() => {
      expect(screen.getByText('New Area...')).toBeInTheDocument()
    })
  })

  it('toggles menu on click', async () => {
    render(
      <TestWrapper>
        <MenuDropdown trigger="People">
          <div>Menu Content</div>
        </MenuDropdown>
      </TestWrapper>
    )

    const trigger = screen.getByRole('button', { name: /people/i })
    
    // Click to open
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.getByText('Menu Content')).toBeInTheDocument()
    })

    // Click to close
    fireEvent.click(trigger)
    await waitFor(() => {
      expect(screen.queryByText('Menu Content')).not.toBeInTheDocument()
    })
  })
})

// MenuItem is tested implicitly through integration tests
// since it's a simple wrapper around navigation and onClick

describe('DropdownSeparator Component', () => {
  it('renders horizontal rule with correct styling', () => {
    render(<DropdownSeparator />)
    
    const separator = screen.getByRole('separator')
    expect(separator).toBeInTheDocument()
    expect(separator).toHaveClass('my-1')
  })
})