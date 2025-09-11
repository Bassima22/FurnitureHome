// src/pages/Account.tsx
import { useAuth } from "../auth/AuthProvider";

export default function Account() {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto mt-10 max-w-lg space-y-4">
      <h1 className="text-2xl font-semibold">Account</h1>
      <div className="rounded-xl border p-4">
        <div>Email: {user?.email}</div>
        <div>Role: {user?.role}</div>
      </div>
      <button className="rounded-xl border px-4 py-2" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
