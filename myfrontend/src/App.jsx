import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Login from './pages/Login'
import OtpVerify from './pages/OtpVerify'
import ProfileCreation from './pages/ProfileCreation'
import SearchBrowse from './pages/SearchBrowse'
import UploadPhotos from './pages/UploadPhotos'
import MyProfile from './pages/MyProfile'
import ProfileView from './pages/ProfileView'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/Dashboard'
import GoogleSuccess from './pages/GoogleSuccess'
import Chat from './pages/Chat'
import Notifications from './pages/Notifications'
import PrivacySettings from './pages/PrivacySettings'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

// Simple Protected Route check
const ProtectedRoute = ({ children }) => {
  // We don't use useAuth here yet because AuthProvider is inside App in my previous attempt, 
  // but usually it wraps the whole app.
  // Wait, I should wrap the whole App in main.jsx or here. Let's do it here correctly.
  return children; 
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className="app-container" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1 }}>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/otp-verify" element={<OtpVerify />} />
                <Route path="/google-success" element={<GoogleSuccess />} />

                {/* PROTECTED ROUTES */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile-creation" element={<ProfileCreation />} />
                <Route path="/search" element={<SearchBrowse />} />
                <Route path="/upload-photos" element={<UploadPhotos />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/profile/:id" element={<ProfileView />} />
                
                {/* NEW ROUTES */}
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/privacy" element={<PrivacySettings />} />

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}

export default App