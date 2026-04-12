import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth as useClerkAuth, useClerk } from "@clerk/clerk-react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn, getToken, isLoaded: isAuthLoaded } = useClerkAuth();
  const { signOut } = useClerk();
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (isUserLoaded && clerkUser) {
      // Map Clerk user to our app's user structure
      setUser({
        _id: clerkUser.id, // We'll use Clerk ID as the primary ID
        userId: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress,
        role: clerkUser.publicMetadata?.role || "user",
        isPremium: clerkUser.publicMetadata?.isPremium || false,
      });
      
      // Update the local token state
      const fetchToken = async () => {
        const t = await getToken();
        setToken(t);
      };
      fetchToken();
    } else if (isUserLoaded && !clerkUser) {
      setUser(null);
      setToken(null);
    }
  }, [clerkUser, isUserLoaded, getToken]);

  const login = () => {
    // Redundant with Clerk pre-built components, but kept for compatibility
  };

  const logout = async () => {
    await signOut();
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  const loading = !isUserLoaded || !isAuthLoaded;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn: !!isSignedIn,
        isPremium: user?.isPremium || false,
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