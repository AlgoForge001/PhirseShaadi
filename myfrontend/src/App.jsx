import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import About from './pages/About'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import OtpVerify from './pages/OtpVerify'
import GoogleSuccess from './pages/GoogleSuccess'
import ProfileCreation from './pages/ProfileCreation'
import SearchBrowse from './pages/SearchBrowse'
import UploadPhotos from './pages/UploadPhotos'
import MyProfile from './pages/MyProfile'
import EditProfile from './pages/EditProfile'
import ProfileView from './pages/ProfileView'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import PrivacySettings from './pages/PrivacySettings'
import ProfileViewers from './pages/ProfileViewers'
import Interests from './pages/Interests'
import FamilyMembers from "./components/FamilyMembers";
import FamilyShortlist from "./components/FamilyShortlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetail from "./pages/admin/AdminUserDetail";
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Chatbot from './components/Chatbot'

const AppRouter = () => {
  const { isLoggedIn, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <div className="loading-screen">Loading...</div>

  const publicPaths = ['/', '/home', '/login', '/register', '/about', '/otp-verify', '/google-success']
  const isPublicRoute = publicPaths.includes(location.pathname)
  const isAdminRoute = location.pathname.startsWith('/admin')

  // Check for Admin access on admin routes
  if (isAdminRoute && (!isLoggedIn || user?.role !== 'admin')) {
    return <Navigate to="/login" replace />
  }

  // Redirect admin from dashboard to admin-dashboard
  if (isLoggedIn && user?.role === 'admin' && location.pathname === '/dashboard') {
    return <Navigate to="/admin-dashboard" replace />
  }

  // Determine if we should show the sidebar (Private user routes only)
  const showSidebar = isLoggedIn && !isPublicRoute && !isAdminRoute;

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {showSidebar && <Sidebar />}
      <div className="main-content" style={{ flex: 1, position: 'relative' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/about" element={<About />} />

          {/* User Private Routes */}
          <Route path="/dashboard" element={<DashboardGuard><Dashboard /></DashboardGuard>} />
          <Route path="/profile-creation" element={<ProtectedRoute><ProfileCreation /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchBrowse /></ProtectedRoute>} />
          <Route path="/upload-photos" element={<ProtectedRoute><UploadPhotos /></ProtectedRoute>} />
          <Route path="/my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><ProfileView /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
          <Route path="/profile-viewers" element={<ProtectedRoute><ProfileViewers /></ProtectedRoute>} />
          <Route path="/family-members" element={<ProtectedRoute><FamilyMembers /></ProtectedRoute>} />
          <Route path="/family-shortlist" element={<ProtectedRoute><FamilyShortlist /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-users" element={<AdminUsers />} />
          <Route path="/admin-users/:userId" element={<AdminUserDetail />} />
          <Route path="/admin/users/:userId" element={<AdminUserDetail />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isLoggedIn ? (user?.role === 'admin' ? "/admin-dashboard" : "/dashboard") : "/"} replace />} />
        </Routes>
        <Chatbot />
      </div>
    </div>
  )
}

// Helper components for route protection
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

const DashboardGuard = ({ children }) => {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role === 'admin') return <Navigate to="/admin-dashboard" replace />
  return children
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App