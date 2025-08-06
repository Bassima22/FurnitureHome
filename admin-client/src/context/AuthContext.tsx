import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from "react";

type AuthContextType = {
  logged: boolean;
  setLogged: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("furniture_app_logged_in")));
  const setLogged = useCallback(
    (logged: boolean) => {
      setLoggedIn(logged);
      localStorage.setItem("furniture_app_logged_in", String(logged));
    },
    [setLoggedIn]
  );
  const value = useMemo(
    () => ({ logged: loggedIn, setLogged }),
    [loggedIn, setLogged]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
