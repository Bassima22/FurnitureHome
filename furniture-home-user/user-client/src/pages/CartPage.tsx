import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
  
import { placeOrder } from "../api/orders";
import OrderModal from "../components/OrderModal";
import { useCart } from "../cart/CartProvider";

export default function CartPage() {
  const { user } = useAuth();
  const { items, subtotal, setQty, remove, refresh } = useCart();
  const [open, setOpen] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const nav = useNavigate();
  const loc = useLocation();

  function openOrder() {
    if (!user) {
      nav("/login", { state: { from: loc } });
      return;
    }
    setOpen(true);
  }

  async function submitOrder(p: { address: string; phone: string; deliveryTime: string }) {
    const { orderId } = await placeOrder(p);
    await refresh(); // cart will be emptied by the server
    setBanner(`Order placed successfully (#${orderId.slice(-6)})`);
  }

  if (!items.length) {
    return (
      <div className="p-6">
        {banner && <div className="mb-3 rounded-lg border bg-green-50 p-3 text-green-800">{banner}</div>}
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      {banner && <div className="rounded-lg border bg-green-50 p-3 text-green-800">{banner}</div>}

      <h1 className="text-2xl font-semibold">Your cart</h1>
      {items.map((it) => (
        <div key={String(it.itemId)} className="flex items-center gap-4 rounded-xl border p-3">
          <img src={it.imgThumbURL} alt={it.title} className="h-16 w-16 rounded object-cover" />
          <div className="flex-1">
            <div className="font-medium">{it.title}</div>
            <div className="text-sm text-gray-600">${it.price}</div>
          </div>
          <input
            type="number"
            className="w-16 rounded border p-1"
            min={0}
            value={it.qty}
            onChange={(e) => setQty(String(it.itemId), Math.max(0, Number(e.target.value) || 0))}
          />
          <button className="rounded border px-3 py-1" onClick={() => remove(String(it.itemId))}>
            Remove
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
        <button onClick={openOrder} className="rounded-xl bg-black px-4 py-2 text-white">
          Order now
        </button>
      </div>

      <OrderModal open={open} onClose={() => setOpen(false)} onSubmit={submitOrder} />
    </div>
  );
}
