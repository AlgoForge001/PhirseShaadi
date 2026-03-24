import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,)

//Nashit its about backend develper
 /*
// In Login.jsx — after API call succeeds:
const { login } = useAuth();
login(data.token, data.user);

// In any component — check if logged in:
const { isLoggedIn, user, logout } = useAuth();

// In Sidebar — for logout button:
const { logout } = useAuth();
<button onClick={logout}>Logout</button>
*/