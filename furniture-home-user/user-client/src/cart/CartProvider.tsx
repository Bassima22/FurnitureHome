import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { getCart, addToCart as apiAdd, updateCartItem as apiUpdate, removeCartItem as apiRemove } from "../api/cart";
import { useAuth } from "../auth/AuthProvider";

type CartItemView = { itemId: string; qty: number; title?: string; price?: number; imgThumbURL?: string };
type CartCtx = {
  items: CartItemView[];
  count: number;
  subtotal: number;
  refresh: () => Promise<void>;
  add: (itemId: string, qty?: number) => Promise<void>;
  setQty: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
};

const Ctx = createContext<CartCtx | undefined>(undefined);
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within <CartProvider>");
  return v;
};

export function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemView[]>([]);
  const [count, setCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); setCount(0); setSubtotal(0); return; }
    const c = await getCart();
    setItems(c.items ?? []);
    setCount(c.count ?? 0);
    setSubtotal(c.subtotal ?? 0);
  }, [user]);

  const add = useCallback(async (itemId: string, qty = 1) => {
    await apiAdd(itemId, qty);
    await refresh();
  }, [refresh]);

  const setQty = useCallback(async (itemId: string, qty: number) => {
    await apiUpdate(itemId, qty);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (itemId: string) => {
    await apiRemove(itemId);
    await refresh();
  }, [refresh]);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({ items, count, subtotal, refresh, add, setQty, remove }),
    [items, count, subtotal, refresh, add, setQty, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
