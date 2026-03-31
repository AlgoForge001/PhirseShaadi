import { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────
// CREATE CONTEXT
// ─────────────────────────────────────────────
const AuthContext = createContext();

// ─────────────────────────────────────────────
// AUTH PROVIDER
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── CHECK IF ALREADY LOGGED IN ON APP START ──
  useEffect(() => {
    try {
      // DEVELOPMENT ONLY: Auto-Login for easier testing
      const mockUser = {
        userId: "679a0ebf356f966144e057f5", 
        name: "Guest Developer",
        email: "guest@example.com",
        role: "user"
      };

      const savedToken = localStorage.getItem("token") || "dev-token-bypass";
      const savedUser = localStorage.getItem("user") || JSON.stringify(mockUser);

      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // Always ensure they are in storage for this session
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", savedToken);
        localStorage.setItem("user", savedUser);
      }
    } catch (error) {
      console.error("Auth Context Init Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── LOGIN FUNCTION ──
  // TODO [BACKEND]: Call POST /api/auth/login before calling this
  // Pass token and user data from API response
  const login = (tokenValue, userData) => {
    // Save to state
    setToken(tokenValue);
    setUser(userData);

    // Save to localStorage so user stays logged in after refresh
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ── LOGOUT FUNCTION ──
  // TODO [BACKEND]: Call POST /api/auth/logout before calling this
  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // ── IS LOGGED IN CHECK ──
  const isLoggedIn = !!token;

  // ── IS PREMIUM CHECK ──
  // TODO [BACKEND]: Get premium status from user object
  const isPremium = user?.plan === "gold" || user?.plan === "platinum";

  // ── UPDATE USER ──
  // Call this after profile update
  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isPremium,
        login,
        logout,
        updateUser,
      }}
    >
      {/* Don't render app until we check localStorage */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// CUSTOM HOOK — use this in any component
// Example: const { user, login, logout } = useAuth();
// ─────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;