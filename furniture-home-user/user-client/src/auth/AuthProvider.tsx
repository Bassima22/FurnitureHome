// src/auth/AuthProvider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { login as apiLogin, register as apiRegister, me as apiMe, logout as apiLogout } from "../api/auth";
import { getToken } from "../api/http";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  role: "user" | "admin";
};

export type AuthCtx = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists, try to fetch /me
  useEffect(() => {
    (async () => {
      try {
        if (getToken()) {
          const u = await apiMe();
          setUser(u);
        }
      } catch {
        // token invalid/expired — ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await apiLogin(email, password);
    setUser(u);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    await apiRegister(email, password, name);
    const u = await apiLogin(email, password); // auto-login after register
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  // Memoize the value object so it doesn't change every render
  const value = useMemo<AuthCtx>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
