import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
function App() {
  return (
    <BrowserRouter>
      <Sidebar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/dashboard" element={<SearchBrowse />} />
        <Route path="/profile-creation" element={<ProfileCreation />} />
        <Route path="/search" element={<SearchBrowse />} />
        <Route path="/upload-photos" element={<UploadPhotos />} />
        <Route path="/my-profile" element={<MyProfile />} />

<Route path="/profile/:id" element={<ProfileView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
