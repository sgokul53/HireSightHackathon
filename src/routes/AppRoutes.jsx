import  { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Login from '../pages/Login'
import RecruiterDashboard from '../pages/RecruiterDashboard'
import RequestorDashboard from '../pages/RequestorDashboard'
import CandidateDashboard from '../pages/CandidateDashboard'
import AdminDashboard from '../pages/AdminDashboard'
import AIAssistant from '../components/AIAssistant'

const AppRoutes = () => {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  const getDashboard = () => {
    switch(user.role) {
      case 'recruiter':
        return <RecruiterDashboard />
      case 'requestor':
        return <RequestorDashboard />
      case 'candidate':
        return <CandidateDashboard />
      case 'admin':
        return <AdminDashboard />
      default:
        return <Navigate to="/login" />
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={getDashboard()} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIAssistant />
    </>
  )
}

export default AppRoutes
 