import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

// Mock user roles based on legacy CakePHP app
export const mockUsers = {
  operations: {
    id: 1,
    username: 'operations',
    roles: ['operations'],
    areas: null, // operations see all areas
  },
  manager: {
    id: 2,
    username: 'manager1',
    roles: ['manager'],
    areas: [1, 2], // manager for specific areas
  },
  personnel: {
    id: 3,
    username: 'personnel1', 
    roles: ['personnel'],
    areas: null, // personnel see only published schedules
  },
}

// Mock API data matching legacy patterns
export const mockApiData = {
  people: [
    {
      id: 1,
      first: 'John',
      last: 'Doe',
      display_name: 'John D.',
      resident_category_id: 1,
      category: {
        id: 1,
        name: 'Resident',
        color: '#FF0000',
      },
    },
    {
      id: 2,
      first: 'Jane',
      last: 'Smith',
      display_name: 'Jane',
      resident_category_id: 2,
      category: {
        id: 2,
        name: 'Attending',
        color: '#0000FF',
      },
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Resident',
      color: '#FF0000',
      order: 1,
    },
    {
      id: 2,
      name: 'Attending',
      color: '#0000FF',
      order: 2,
    },
  ],
  schedules: [
    {
      id: 1,
      name: 'November 2024',
      user_id: 1,
      published: false,
      request: 0, // 0=draft, 1=submitted, 2=in_progress
      template: false,
    },
    {
      id: 2,
      name: 'Published',
      user_id: null,
      published: true,
      request: 0,
      template: false,
    },
  ],
}

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    queryClient?: QueryClient
    initialEntries?: string[]
  }
) => {
  const queryClient = options?.queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

// Mock auth store with different user types
export const mockAuthStore = (userType: keyof typeof mockUsers = 'operations') => {
  const user = mockUsers[userType]
  return {
    user,
    token: 'mock-jwt-token',
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    isOperations: () => user.roles.includes('operations'),
    isManager: () => user.roles.includes('manager'),
    isPersonnel: () => user.roles.includes('personnel'),
  }
}

// Mock API responses
export const mockApiHandlers = {
  getPeople: vi.fn().mockResolvedValue(mockApiData.people),
  createPerson: vi.fn().mockResolvedValue({
    id: 3,
    first: 'New',
    last: 'Person',
    display_name: 'New Person',
    resident_category_id: 1,
  }),
  getCategories: vi.fn().mockResolvedValue(mockApiData.categories),
  createCategory: vi.fn().mockResolvedValue({
    id: 3,
    name: 'New Category',
    color: '#00FF00',
    order: 3,
  }),
  getSchedules: vi.fn().mockResolvedValue(mockApiData.schedules),
}

// Utility to wait for async operations (like AJAX in legacy)
export const waitForAsyncOperation = () => 
  new Promise(resolve => setTimeout(resolve, 0))

// Mock keyboard shortcuts (legacy had extensive shortcuts)
export const mockKeyboardEvent = (key: string, options?: KeyboardEventInit) =>
  new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options,
  })

// Test helpers for role-based functionality
export const shouldShowForRole = (role: string, element: HTMLElement | null) => {
  switch (role) {
    case 'operations':
      return expect(element).toBeInTheDocument()
    case 'manager':
      return expect(element).toBeInTheDocument()
    case 'personnel':
      return expect(element).not.toBeInTheDocument()
    default:
      return expect(element).not.toBeInTheDocument()
  }
}

// Legacy-style form validation helpers
export const expectFormValidation = {
  required: (field: HTMLElement) => {
    expect(field).toBeRequired()
  },
  pattern: (field: HTMLElement, pattern: string) => {
    expect(field).toHaveAttribute('pattern', pattern)
  },
  unique: async (field: HTMLElement, existingValues: string[]) => {
    // Simulate server-side unique validation
    const value = (field as HTMLInputElement).value
    if (existingValues.includes(value)) {
      throw new Error('Value must be unique')
    }
  },
}

export * from '@testing-library/react'
export { customRender as render, vi }