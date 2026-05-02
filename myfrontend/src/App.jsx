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
import ProfileView from './pages/ProfileView'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Dashboard'
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

const ADMIN_PATHS = ['/admin-dashboard', '/admin-users']
const PUBLIC_PATHS = ['/', '/home', '/login', '/register', '/about', '/otp-verify', '/google-success']

const AppRouter = () => {
  const { isLoggedIn, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <div className="loading-screen">Loading...</div>

  const path = location.pathname
  const isAdmin = user?.role === 'admin'

  // Is this an admin route?
  const isAdminRoute = ADMIN_PATHS.includes(path)
    || path.startsWith('/admin-users/')
    || path.startsWith('/admin/')

  // Is this a public route?
  const isPublicRoute = PUBLIC_PATHS.includes(path)

  // Show sidebar only on private (non-admin, non-public) routes
  const showSidebar = isLoggedIn && !isPublicRoute && !isAdminRoute

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* ── Public Routes ─────────────────────────────── */}
          <Route path="/"               element={<LandingPage />} />
          <Route path="/home"           element={<LandingPage />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/register"       element={<Register />} />
          <Route path="/otp-verify"     element={<OtpVerify />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/about"          element={<About />} />

          {/* ── Private User Routes ────────────────────────── */}
          <Route path="/dashboard"       element={isLoggedIn ? (isAdmin ? <Navigate to="/admin-dashboard" replace /> : <Dashboard />) : <Navigate to="/login" replace />} />
          <Route path="/profile-creation" element={isLoggedIn ? <ProfileCreation /> : <Navigate to="/login" replace />} />
          <Route path="/search"           element={isLoggedIn ? <SearchBrowse /> : <Navigate to="/login" replace />} />
          <Route path="/upload-photos"    element={isLoggedIn ? <UploadPhotos /> : <Navigate to="/login" replace />} />
          <Route path="/my-profile"       element={isLoggedIn ? <MyProfile /> : <Navigate to="/login" replace />} />
          <Route path="/edit-profile"     element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" replace />} />
          <Route path="/profile/:id"      element={isLoggedIn ? <ProfileView /> : <Navigate to="/login" replace />} />
          <Route path="/chat"             element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />} />
          <Route path="/chat/:id"         element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />} />
          <Route path="/interests"        element={isLoggedIn ? <Interests /> : <Navigate to="/login" replace />} />
          <Route path="/notifications"    element={isLoggedIn ? <Notifications /> : <Navigate to="/login" replace />} />
          <Route path="/privacy"          element={isLoggedIn ? <PrivacySettings /> : <Navigate to="/login" replace />} />
          <Route path="/profile-viewers"  element={isLoggedIn ? <ProfileViewers /> : <Navigate to="/login" replace />} />
          <Route path="/family-members"   element={isLoggedIn ? <FamilyMembers /> : <Navigate to="/login" replace />} />
          <Route path="/family-shortlist" element={isLoggedIn ? <FamilyShortlist /> : <Navigate to="/login" replace />} />

          {/* ── Admin Routes ───────────────────────────────── */}
          <Route path="/admin-dashboard"       element={(isLoggedIn && isAdmin) ? <AdminDashboard /> : <Navigate to="/login" replace />} />
          <Route path="/admin-users"           element={(isLoggedIn && isAdmin) ? <AdminUsers /> : <Navigate to="/login" replace />} />
          <Route path="/admin-users/:userId"   element={(isLoggedIn && isAdmin) ? <AdminUserDetail /> : <Navigate to="/login" replace />} />
          <Route path="/admin/users/:userId"   element={(isLoggedIn && isAdmin) ? <AdminUserDetail /> : <Navigate to="/login" replace />} />

          {/* ── Fallback ────────────────────────────────────── */}
          <Route path="*" element={
            isLoggedIn
              ? (isAdmin ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/dashboard" replace />)
              : <Navigate to="/" replace />
          } />
        </Routes>
        <Chatbot />
      </div>
    </div>
  )
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