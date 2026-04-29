import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import LandingPage  from "./pages/student/LandingPage";
import KursusPage   from "./pages/student/KursusPage";
import VideoPage    from "./pages/student/VideoPage";
import QuizPage     from "./pages/student/QuizPage";
import PerformaPage from "./pages/student/PerformaPage";
import MentorPage   from "./pages/student/MentorPage";
import { LoginPage, RegisterPage } from "./pages/student/AuthPages";

const NO_NAVBAR = ['/login', '/register']

// Halaman yang butuh login
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl font-black mb-2">
          <span className="text-violet-600">Edu</span><span className="text-emerald-500">Reach</span>
        </div>
        <div className="text-sm text-gray-400 animate-pulse">Memuat...</div>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return children
}

function AppContent() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Helper: navigate + scroll to top
  function go(path) {
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const showNavbar = !NO_NAVBAR.includes(location.pathname)

  return (
    <div className="min-h-screen bg-white">
      {showNavbar && (
        <Navbar
          activePage={location.pathname.replace('/', '') || 'landing'}
          onNavigate={go}
          user={user}
        />
      )}
      <Routes>
        <Route path="/"         element={<LandingPage  onNavigate={go} />} />
        <Route path="/kursus"   element={<KursusPage   onNavigate={go} />} />
        <Route path="/mentor"   element={<MentorPage   onNavigate={go} />} />
        <Route path="/login"    element={<LoginPage    onNavigate={go} />} />
        <Route path="/register" element={<RegisterPage onNavigate={go} />} />

        {/* Protected routes */}
        <Route path="/video" element={
          <ProtectedRoute><VideoPage onNavigate={go} /></ProtectedRoute>
        } />
        <Route path="/kuis" element={
          <ProtectedRoute><QuizPage onNavigate={go} /></ProtectedRoute>
        } />
        <Route path="/performa" element={
          <ProtectedRoute><PerformaPage onNavigate={go} /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}