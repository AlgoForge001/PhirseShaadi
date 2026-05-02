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

// ─── Admin Protected Wrapper ───────────────────────────────────────────────────
const AdminLayout = () => {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn || user?.role !== 'admin') return <Navigate to="/login" replace />
  return (
    <>
      <Routes>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<AdminUsers />} />
        <Route path="/admin-users/:userId" element={<AdminUserDetail />} />
      </Routes>
      <Chatbot />
    </>
  )
}

// ─── Main App Router ──────────────────────────────────────────────────────────
const AppRouter = () => {
  const { isLoggedIn, loading, user } = useAuth()
  const location = useLocation()

  if (loading) return <div className="loading-screen">Loading...</div>

  // All admin paths — includes hyphenated /admin-* and slash /admin/*
  const isAdminRoute = location.pathname === '/admin-dashboard'
    || location.pathname === '/admin-users'
    || location.pathname.startsWith('/admin-users/')
    || location.pathname.startsWith('/admin/');

  // Redirect admin to admin dashboard if they visit /dashboard
  if (isLoggedIn && user?.role === 'admin' && location.pathname === '/dashboard') {
    return <Navigate to="/admin-dashboard" replace />
  }

  // Serve admin layout for all admin routes
  if (isAdminRoute) {
    if (!isLoggedIn || user?.role !== 'admin') return <Navigate to="/login" replace />
    return <AdminLayout />
  }

  // Public routes
  const publicPaths = ['/', '/home', '/login', '/register', '/about', '/otp-verify', '/google-success']
  const isPublicRoute = publicPaths.includes(location.pathname)

  if (isPublicRoute) {
    return (
      <>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-verify" element={<OtpVerify />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
      </>
    )
  }

  // Private routes (with Sidebar)
  if (!isLoggedIn) return <Navigate to="/login" replace />

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1 }}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile-creation" element={<ProfileCreation />} />
            <Route path="/search" element={<SearchBrowse />} />
            <Route path="/upload-photos" element={<UploadPhotos />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/profile/:id" element={<ProfileView />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route path="/interests" element={<Interests />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/privacy" element={<PrivacySettings />} />
            <Route path="/profile-viewers" element={<ProfileViewers />} />
            <Route path="/family-members" element={<FamilyMembers />} />
            <Route path="/family-shortlist" element={<FamilyShortlist />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
      <Chatbot />
    </>
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