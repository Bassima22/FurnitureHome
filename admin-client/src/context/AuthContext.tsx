import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from 'react';

type AuthContextType = {
  logged: boolean;
  setLogged: (val: boolean) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [logged, setLogged] = useState(false);
  const value = useMemo(() => ({ logged, setLogged }), [logged]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
