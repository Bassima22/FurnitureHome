// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setLoading(true);
    try {
      await register(email, password, name);
      nav("/"); // go home after auto-login
    } catch {
      setErr("Could not register (email may already be in use).");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-sm">
      <h1 className="mb-4 text-2xl font-semibold">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full rounded-xl border p-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full rounded-xl border p-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full rounded-xl border p-3" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-60" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 underline">Log in</Link>
      </p>
    </div>
  );
}
