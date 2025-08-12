import { ReactNode } from 'react'
import Header from './Header'
import { GlobalModalProvider } from '../../contexts/GlobalModalContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <GlobalModalProvider>
      <div id="container">
        <div id="content">
          <Header />
          {children}
        </div>
      </div>
    </GlobalModalProvider>
  )
}