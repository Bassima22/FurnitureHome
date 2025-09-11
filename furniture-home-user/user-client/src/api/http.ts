const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

export function setToken(t: string | null) {
  if (t) sessionStorage.setItem("token", t);
  else sessionStorage.removeItem("token");
}

export function getToken() {
  return sessionStorage.getItem("token");
}

export async function api(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers || {});
  const t = getToken();
  if (t) headers.set("Authorization", `Bearer ${t}`);
  return fetch(`${API}${path}`, { ...init, headers });
}
