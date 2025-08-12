import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { GlobalModalProvider } from '../../contexts/GlobalModalContext'

interface TestWrapperProps {
  children: ReactNode
}

export function createTestWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  })

  return function TestWrapper({ children }: TestWrapperProps) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <GlobalModalProvider>
            {children}
          </GlobalModalProvider>
        </BrowserRouter>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(ui: React.ReactElement) {
  const Wrapper = createTestWrapper()
  return { wrapper: Wrapper }
}