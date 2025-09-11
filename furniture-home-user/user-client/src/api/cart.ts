import { api } from "./http";

export async function getCart() {
  const r = await api("/cart");
  if (!r.ok) throw new Error(await r.text());
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return r.json() as Promise<{ items: any[]; count: number; subtotal: number }>;
}

export async function addToCart(itemId: string, qty = 1) {
  const r = await api("/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, qty }),
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function updateCartItem(itemId: string, qty: number) {
  const r = await api("/cart/item", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, qty }),
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function removeCartItem(itemId: string) {
  const r = await api(`/cart/item/${itemId}`, { method: "DELETE" });
  if (!r.ok) throw new Error(await r.text());
}
