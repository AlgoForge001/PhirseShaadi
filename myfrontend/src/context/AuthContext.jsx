import { createContext, useContext, useState, useEffect } from "react";

// ─────────────────────────────────────────────
// CREATE CONTEXT
// ─────────────────────────────────────────────
const AuthContext = createContext();

// ─────────────────────────────────────────────
// AUTH PROVIDER (JWT + localStorage)
// ─────────────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!token && !!user;
  const isPremium = user?.isPremium || false;

  useEffect(() => {
    // Keep localStorage in sync if user or token changes
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  const login = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

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
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

export default AuthContext;