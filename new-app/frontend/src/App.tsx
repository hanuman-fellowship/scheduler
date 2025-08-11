import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import BigBoardPage from './pages/BigBoardPage'
import { useAuthStore } from './store/authStore'

function App() {
  const { token } = useAuthStore()

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoginPage />
      </div>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule/:id?" element={<SchedulePage />} />
          <Route path="/board" element={<BigBoardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App