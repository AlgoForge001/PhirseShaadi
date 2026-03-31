import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import About from './pages/About'
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
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className="app-container" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="main-content" style={{ flex: 1 }}>
              <Routes>
                {/* MAIN ROUTES */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
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