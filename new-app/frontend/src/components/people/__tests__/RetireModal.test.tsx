import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RetireModal } from '../RetireModal'

// Mock fetch globally
global.fetch = vi.fn()

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(() => 'fake-token'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

const mockPeopleByCategory = {
  "1": {
    "category": {
      "id": 1,
      "name": "Residents",
      "color": "#008080",
      "sortOrder": 1
    },
    "people": [
      {
        "id": 1,
        "first": "John",
        "last": "Doe",
        "displayName": "John"
      },
      {
        "id": 2,
        "first": "Jane",
        "last": "Smith",
        "displayName": "Jane"
      }
    ]
  },
  "2": {
    "category": {
      "id": 2,
      "name": "Staff",
      "color": "#FF0000",
      "sortOrder": 2
    },
    "people": [
      {
        "id": 3,
        "first": "Bob",
        "last": "Johnson",
        "displayName": "Bob"
      }
    ]
  }
}

const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })
  
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  )
}

describe('RetireModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Setup successful fetch response for people-by-category
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockPeopleByCategory)
    } as Response)
  })

  it('should render modal when open', async () => {
    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('Retire People')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    renderWithProviders(
      <RetireModal isOpen={false} onClose={vi.fn()} />
    )

    expect(screen.queryByText('Retire People')).not.toBeInTheDocument()
  })

  it('should load and display people grouped by category', async () => {
    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('Residents')).toBeInTheDocument()
      expect(screen.getByText('Staff')).toBeInTheDocument()
      expect(screen.getByText('John')).toBeInTheDocument()
      expect(screen.getByText('Jane')).toBeInTheDocument()
      expect(screen.getByText('Bob')).toBeInTheDocument()
    })
  })

  it('should allow selecting individual people', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    const johnCheckbox = screen.getByRole('checkbox', { name: /John/ })
    await user.click(johnCheckbox)

    expect(johnCheckbox).toBeChecked()
    expect(screen.getByText('1 people selected for retirement')).toBeInTheDocument()
  })

  it('should allow selecting all people in a category', async () => {
    const user = userEvent.setup()
    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('Residents')).toBeInTheDocument()
    })

    // Find the "All" checkbox for the Residents category
    const allCheckboxes = screen.getAllByRole('checkbox', { name: /All/ })
    const residentsAllCheckbox = allCheckboxes[0] // First category is Residents
    
    await user.click(residentsAllCheckbox)

    expect(residentsAllCheckbox).toBeChecked()
    expect(screen.getByText('2 people selected for retirement')).toBeInTheDocument()
  })

  it('should submit retirement request when form is submitted', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()

    // Mock successful retirement response
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPeopleByCategory)
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          message: 'People retired: John',
          retiredCount: 1,
          retiredNames: ['John']
        })
      } as Response)

    renderWithProviders(
      <RetireModal isOpen={true} onClose={onClose} />
    )

    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument()
    })

    // Select John for retirement
    const johnCheckbox = screen.getByRole('checkbox', { name: /John/ })
    await user.click(johnCheckbox)

    // Submit the form
    const retireButton = screen.getByRole('button', { name: 'Retire People' })
    await user.click(retireButton)

    // Should call the retire API
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/people/retire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer fake-token'
        },
        body: JSON.stringify({ peopleIds: [1] })
      })
    })
  })

  it('should disable submit button when no people selected', async () => {
    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('Residents')).toBeInTheDocument()
    })

    const retireButton = screen.getByRole('button', { name: 'Retire People' })
    expect(retireButton).toBeDisabled()
  })

  it('should show loading state', () => {
    vi.mocked(fetch).mockResolvedValue(new Promise(() => {})) // Never resolves

    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    expect(screen.getByText('Loading people...')).toBeInTheDocument()
  })

  it('should show empty state when no people available', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({})
    } as Response)

    renderWithProviders(
      <RetireModal isOpen={true} onClose={vi.fn()} />
    )

    await waitFor(() => {
      expect(screen.getByText('No people found to retire')).toBeInTheDocument()
    })
  })
})