import { api, setToken } from "./http";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

type User = { id: string; email: string; name?: string; role: "user" | "admin" };

export async function register(email: string, password: string, name?: string) {
  const r = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<{ id: string; email: string; name?: string }>;
}

export async function login(email: string, password: string) {
  const r = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!r.ok) throw new Error("Invalid credentials");
  const data = await r.json() as { token: string; user: User };
  setToken(data.token);
  return data.user;
}

export async function me() {
  const r = await api("/auth/me");
  if (!r.ok) throw new Error("Unauthorized");
  return r.json() as Promise<User>;
}

export function logout() {
  setToken(null);
}
