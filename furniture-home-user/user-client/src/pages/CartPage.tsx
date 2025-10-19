import { useState, useRef } from "react";
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
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const nav = useNavigate();
  const loc = useLocation();

  // Utility: show temporary toast
  function showToast(msg: string, ms = 2000) {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), ms);
  }

  function openOrder() {
    if (!user) {
      nav("/login", { state: { from: loc } });
      return;
    }
    setOpen(true);
  }

  async function submitOrder(p: {
    address: string;
    phone: string;
    deliveryTime: string;
  }) {
    const { orderId } = await placeOrder(p);
    await refresh(); // cart will be emptied by the server
    setBanner(`Order placed successfully (#${orderId.slice(-6)})`);
  }

  if (!items.length) {
    return (
      <div className="p-6">
        {banner && (
          <div className="mb-3 rounded-lg border bg-green-50 p-3 text-green-800">
            {banner}
          </div>
        )}
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4 relative">
      {banner && (
        <div className="rounded-lg border bg-green-50 p-3 text-green-800">
          {banner}
        </div>
      )}

      <h1 className="text-2xl font-semibold">Your cart</h1>

      {items.map((it) => (
        <CartItemRow
          key={String(it.itemId)}
          it={it}
          setQty={setQty}
          remove={remove}
          showToast={showToast}
        />
      ))}

      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold">
          Subtotal: ${subtotal.toFixed(2)}
        </div>
        <button
          onClick={openOrder}
          className="rounded-xl bg-black px-4 py-2 text-white hover:bg-gray-800 transition"
        >
          Order now
        </button>
      </div>

      <OrderModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={submitOrder}
      />

      {/* Toast message */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-stone-200 bg-white/90 px-4 py-2 text-sm shadow-md backdrop-blur"
        >
          ✅ {toast}
        </div>
      )}
    </div>
  );
}

/* -----------------------------
   🧱 Cart Item Row Component
------------------------------ */

function CartItemRow({
  it,
  setQty,
  remove,
  showToast,
}: Readonly<{
  it: any;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  showToast: (msg: string) => void;
}>) {
  const [tempQty, setTempQty] = useState(String(it.qty));

  return (
    <div className="flex items-center gap-4 rounded-xl border p-3">
      <img
        src={it.imgThumbURL}
        alt={it.title}
        className="h-16 w-16 rounded object-cover"
      />
      <div className="flex-1">
        <div className="font-medium">{it.title}</div>
        <div className="text-sm text-gray-600">${it.price}</div>
      </div>

      <input
        type="number"
        className="w-16 rounded border p-1"
        min={0}
        value={tempQty}
        onChange={(e) => setTempQty(e.target.value)} // allows clearing
        onBlur={() => {
          const val = tempQty.trim();

          if (val === "") {
            // empty input → revert to previous qty
            setTempQty(String(it.qty));
            return;
          }

          const num = Number(val);
          if (isNaN(num)) {
            setTempQty(String(it.qty));
            return;
          }

          if (num <= 0) {
            remove(String(it.itemId));
            showToast(`Removed "${it.title}"`);
          } else if (num !== it.qty) {
            setQty(String(it.itemId), num);
            showToast(`Updated "${it.title}" to ${num}`);
          }
        }}
      />

      <button
        className="rounded border px-3 py-1 hover:bg-gray-50"
        onClick={() => {
          remove(String(it.itemId));
          showToast(`Removed "${it.title}"`);
        }}
      >
        Remove
      </button>
    </div>
  );
}
