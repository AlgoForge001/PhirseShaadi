import { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────
// CREATE CONTEXT
// ─────────────────────────────────────────────
const AuthContext = createContext();

// ─────────────────────────────────────────────
// AUTH PROVIDER (DEVELOPMENT MODE — No login required)
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: "dev-user-001",
    userId: "dev-user-001",
    name: "Guest Developer",
    email: "guest@example.com",
    role: "user",
    isPremium: true,
  });

  // Always "logged in" for dev
  const token = "dev-token-bypass";
  const isLoggedIn = true;
  const isPremium = true;
  const loading = false;

  // No-op functions (kept so components don't crash)
  const login = () => {};
  const logout = () => {};
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
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
      {children}
    </AuthContext.Provider>
  );
};

// ─────────────────────────────────────────────
// CUSTOM HOOK
// ─────────────────────────────────────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;