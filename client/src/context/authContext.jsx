import { createContext, useContext, useState, useEffect } from "react";
import { setAccessTokenStore, clearAccessTokenStore } from "../api/tokenStore";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessTokenState] = useState(null);
  const [user, setUser] = useState(null);
  // isLoading = true until we know whether a session can be restored
  const [isLoading, setIsLoading] = useState(true);

  const setAccessToken = (token) => {
    setAccessTokenState(token);
    if (token) {
      setAccessTokenStore(token);
    } else {
      clearAccessTokenStore();
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  // ── SESSION RESTORE ────────────────────────────────────────────
  // On every app mount, try to silently restore the session using
  // the httpOnly refreshToken cookie set by the backend.
  // /api/auth/refresh returns { accessToken, user } if the cookie
  // is valid, 401 if not.
  // The axios interceptor is patched to NOT retry /auth/refresh on
  // 401, so this call never loops.
  useEffect(() => {
    let cancelled = false;
    const restore = async () => {
      try {
        const res = await api.post("/auth/refresh");
        if (!cancelled && res?.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          if (res.data.user) setUser(res.data.user);
        }
      } catch {
        // No valid session — stay logged out
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    restore();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        user,
        setUser,
        isLoading,
        setIsLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);