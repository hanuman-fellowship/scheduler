import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute'
import { useAuthStore } from '../../../store/authStore'

// Mock the auth store hook
vi.mock('../../../store/authStore', () => ({
  useAuthStore: vi.fn()
}))

// Mock child component
const TestComponent = () => <div>Protected Content</div>

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderWithRouter = (element: React.ReactElement, initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        {element}
      </MemoryRouter>
    )
  }

  it('renders children when no role requirements are specified', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => false,
      isManager: () => false,
      hasRole: () => false,
      setAuth: vi.fn(),
      logout: vi.fn(),
      token: null,
      user: null,
    } as any)

    renderWithRouter(
      <ProtectedRoute>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects when operations role is required but user is not operations', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => false,
      isManager: () => false,
    } as any)

    renderWithRouter(
      <ProtectedRoute requireOperations>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  // No loading state in current implementation

  it('allows access when operations role is required and user is operations', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => true,
      isManager: () => false,
    } as any)

    renderWithRouter(
      <ProtectedRoute requireOperations>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('allows access when manager role is required and user is manager', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => false,
      isManager: () => true,
    } as any)

    renderWithRouter(
      <ProtectedRoute requireManager>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  // No personnel flag in current implementation

  it('denies access when manager is required and user is neither manager nor operations', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => false,
      isManager: () => false,
    } as any)

    renderWithRouter(
      <ProtectedRoute requireManager>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  // Combined roles behavior is implicit via flags

  it('allows access to manager-required route when user is operations', () => {
    vi.mocked(useAuthStore).mockReturnValue({
      isOperations: () => true,
      isManager: () => false,
    } as any)

    renderWithRouter(
      <ProtectedRoute requireManager>
        <TestComponent />
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  // Covered by first test

  // Not applicable with current flags-only API

  // Redirect with location state not applicable in current implementation
});