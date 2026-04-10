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
import FamilyMembers from "./components/FamilyMembers";
import FamilyShortlist from "./components/FamilyShortlist";
import { AuthProvider, useAuth } from './context/AuthContext'
import { useUser } from "@clerk/clerk-react";
import { SocketProvider } from './context/SocketContext'
import { ClerkProvider } from '@clerk/clerk-react'

const PublicLayout = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/about" element={<About />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

const PrivateLayout = () => (
  <div className="app-container" style={{ display: 'flex' }}>
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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/privacy" element={<PrivacySettings />} />
        <Route path="/profile-viewers" element={<ProfileViewers />} />

        <Route path="/family-members" element={<FamilyMembers />} />
        <Route path="/family-shortlist" element={<FamilyShortlist />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  </div>
)

const AppRouter = () => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // ⬇️ YE LINE YAHA ADD KARO
  if (!isLoaded) return null;

  const publicPaths = ['/', '/about']
  const isPublicRoute = publicPaths.includes(location.pathname) ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register')

  // ⬇️ YE LOGIC YAHA ADD KARO
  if (isSignedIn && isPublicRoute && location.pathname !== '/about') {
    return <Navigate to="/dashboard" replace />
  }

  return isPublicRoute ? <PublicLayout /> : <PrivateLayout />
}

const { isSignedIn, isLoaded } = useUser();


function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ClerkProvider>
  )
}

export default App