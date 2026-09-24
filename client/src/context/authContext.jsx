import { createContext, useContext, useState, useEffect } from "react";
import { setAccessTokenStore, clearAccessTokenStore } from "../api/tokenStore";
import api from "../api/axios";

const AuthContext = createContext();

let restorePromise = null;

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

    if (!restorePromise) {
      restorePromise = api.post("/auth/refresh").finally(() => {
        restorePromise = null;
      });
    }

    restorePromise
      .then((res) => {
        if (!cancelled && res?.data?.accessToken) {
          setAccessToken(res.data.accessToken);
          if (res.data.user) setUser(res.data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAccessToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

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
        isLoggedIn: !!accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);