import { ReactNode } from 'react'
import Header from './Header'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div id="container">
      <div id="content">
        <Header />
        {children}
      </div>
    </div>
  )
}