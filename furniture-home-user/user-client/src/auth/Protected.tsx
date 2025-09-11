import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { JSX } from "react";

export default function Protected({ children }: Readonly<{ children: JSX.Element }>) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  return children;
}
