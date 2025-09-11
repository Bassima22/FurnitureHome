// src/pages/LoginPage.tsx
import { useState } from "react";
import { Link,  useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await login(email, password);
      nav("/");
    } catch {
      setErr("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Log in</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-60" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Don’t have an account yet?{" "}
        <Link to="/register" className="text-blue-600 underline">Create one</Link>
      </p>
    </div>
  );
}
