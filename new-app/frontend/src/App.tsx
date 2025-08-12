import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import SchedulePage from './pages/SchedulePage'
import BigBoardPage from './pages/BigBoardPage'
import PeoplePage from './pages/PeoplePage'
import AreasPage from './pages/AreasPage'
import UsersPage from './pages/UsersPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { ScheduleView } from './components/schedules/ScheduleView'
import { useAuthStore } from './store/authStore'
import { useScheduleStore } from './store/scheduleStore'

function App() {
  const { token } = useAuthStore()
  const { loadCurrentSchedule } = useScheduleStore()

  // Load current schedule when user is authenticated
  useEffect(() => {
    if (token) {
      loadCurrentSchedule()
    }
  }, [token, loadCurrentSchedule])

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
          <Route path="/schedule-view/:type/:id" element={<ScheduleView />} />
          <Route path="/board" element={<BigBoardPage />} />
          <Route path="/people" element={<PeoplePage />} />
          <Route 
            path="/areas" 
            element={
              <ProtectedRoute requireOperations>
                <AreasPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requireOperations>
                <UsersPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App