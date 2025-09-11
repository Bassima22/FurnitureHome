import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (p: { address: string; phone: string; deliveryTime: string }) => Promise<void>;
};

export default function OrderModal({ open, onClose, onSubmit }: Readonly<Props>) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!address.trim() || !phone.trim() || !deliveryTime.trim()) {
      setErr("All fields are required.");
      return;
    }
    try {
      setLoading(true);
      await onSubmit({ address, phone, deliveryTime });
      onClose();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="mb-3 text-xl font-semibold">Delivery details</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            className="w-full rounded-xl border p-3"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            className="w-full rounded-xl border p-3"
            placeholder="Preferred delivery time (e.g., Tomorrow 5–7pm)"
            value={deliveryTime}
            onChange={(e) => setDeliveryTime(e.target.value)}
          />

          {err && <p className="text-sm text-red-600">{err}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="rounded-xl border px-4 py-2 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading}
              className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60">
              {loading ? "Placing…" : "Place order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
