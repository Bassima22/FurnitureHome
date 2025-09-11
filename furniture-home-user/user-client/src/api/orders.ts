import { api } from "./http";

export async function placeOrder(payload: {
  address: string;
  phone: string;
  deliveryTime: string;
}) {
  const r = await api("/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await r.text();
  const data = (() => { try { return JSON.parse(text); } catch { return {}; } })();
  if (!r.ok) throw new Error(data?.message || text || `HTTP ${r.status}`);
  return data as { ok: true; orderId: string };
}
