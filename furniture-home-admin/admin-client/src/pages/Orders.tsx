// src/pages/OrdersAdminPage.tsx
import { useEffect, useState, type ReactNode } from "react";
import RevealId from "../components/RevealID";


const API = import.meta.env.VITE_API_URL ?? "http://localhost:5050";

type OrderItem = {
  itemId: string;
  title: string;
  qty: number;
  price: number;
  imgThumbURL?: string;
};

type Order = {
  _id: string;
  userId?: string;
  userName?: string;   // make sure your API includes this (via $lookup) if you want it filled
  userEmail?: string;  // optional, handy to show/mail
  items: OrderItem[];
  count: number;
  subtotal: number;
  address: string;
  phone: string;
  deliveryTime: string;
  status?: "pending" | "handled" | string;
  createdAt: string;
  handledAt?: string;
};

function Th({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
      {children}
    </th>
  );
}
function Td({
  children,
  ...rest
}: Readonly<{ children: ReactNode } & React.TdHTMLAttributes<HTMLTableCellElement>>) {
  return (
    <td className="px-4 py-3 align-top" {...rest}>
      {children}
    </td>
  );
}

export default function OrdersAdminPage() {
  const [pending, setPending] = useState<Order[]>([]);
  const [handled, setHandled] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Order | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // load both lists
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${API}/api/orders`).then((r) => r.json()),
      fetch(`${API}/api/orders/handled`).then((r) => r.json()),
    ])
      .then(([p, h]) => {
        setPending(p ?? []);
        setHandled(h ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  // mark one order handled (optimistic)
  async function markHandled(id: string) {
    setActionError(null);

    const prev = pending;
    const moved = pending.find((o) => o._id === id) || null;

    // optimistic UI
    setPending((curr) => curr.filter((o) => o._id !== id));
    if (moved) {
      setHandled((curr) => [
        { ...moved, status: "handled", handledAt: new Date().toISOString() },
        ...curr,
      ]);
    }
    setOpen(false);

    try {
      const res = await fetch(`${API}/api/orders/${id}/handled`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      setActive(null);
    } catch (err) {
      // rollback
      setPending(prev);
      if (moved) setHandled((curr) => curr.filter((o) => o._id !== id));
      setOpen(true);
      setActionError(err instanceof Error ? err.message : "Failed to set as handled.");
    }
  }

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Orders</h1>

      {/* PENDING */}
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Order</Th>
              <Th>User</Th>
              <Th>Items</Th>
              <Th>Count</Th>
              <Th>Subtotal</Th>
              <Th>Delivery</Th>
              <Th>Address / Phone</Th>
              <Th>Created</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {pending.length === 0 ? (
              <tr>
                <Td colSpan={9}>No pending orders.</Td>
              </tr>
            ) : (
              pending.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <Td>
                    <RevealId text={o._id} label="ID" />
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      {o.userId ? <RevealId text={o.userId} label="ID" /> : <span>—</span>}
                      <span className="text-sm">{o.userName ?? "—"}</span>
                    </div>
                  </Td>
                  <Td>
                    <button
                      className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                      onClick={() => {
                        setActive(o);
                        setOpen(true);
                      }}
                    >
                      View
                    </button>
                  </Td>
                  <Td>{o.count}</Td>
                  <Td>${Number(o.subtotal ?? 0).toFixed(2)}</Td>
                  <Td>{o.deliveryTime || "—"}</Td>
                  <Td>
                    <div className="whitespace-pre-wrap break-words">{o.address}</div>
                    <div className="text-gray-600">{o.phone}</div>
                  </Td>
                  <Td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</Td>
                  <Td>
                    <button
                      className="rounded px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => markHandled(o._id)}
                    >
                      Set to Handled
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* HANDLED */}
      <h2 className="text-lg font-semibold mt-8 mb-3">Handled Orders</h2>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Order</Th>
              <Th>User</Th>
              <Th>Items</Th>
              <Th>Count</Th>
              <Th>Subtotal</Th>
              <Th>Delivery</Th>
              <Th>Address / Phone</Th>
              <Th>Handled</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {handled.length === 0 ? (
              <tr>
                <Td colSpan={8}>No handled orders yet.</Td>
              </tr>
            ) : (
             handled.map((o) => (
  <tr key={o._id} className="hover:bg-gray-50">
    <Td>
      <RevealId text={o._id} label="ID" />
    </Td>
    <Td>
      <div className="flex items-center gap-2">
        {o.userId ? <RevealId text={o.userId} label="ID" /> : <span>—</span>}
        <span className="text-sm">{o.userName ?? "—"}</span>
      </div>
    </Td>
    <Td>
      <button
        className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
        onClick={() => { setActive(o); setOpen(true); }}
      >
        View
      </button>
    </Td>
    <Td>{o.count}</Td>
    <Td>${Number(o.subtotal ?? 0).toFixed(2)}</Td>
    <Td>{o.deliveryTime || "—"}</Td>

    {/* ✅ add this cell */}
    <Td>
      <div className="whitespace-pre-wrap break-words">{o.address || "—"}</div>
      <div className="text-gray-600">{o.phone || ""}</div>
    </Td>

    <Td>{o.handledAt ? new Date(o.handledAt).toLocaleString() : "—"}</Td>
  </tr>
))

            )}
          </tbody>
        </table>
      </div>

      {/* DETAILS MODAL */}
      {open && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow p-4 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">
                Order&nbsp;
                <RevealId text={active._id} label="ID" />
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black"
                title="Close"
              >
                X
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold">User:</span>
                {active.userId ? <RevealId text={active.userId} label="ID" /> : "—"}
                <span className="text-sm">{active.userName ?? "—"}</span>
              </div>
              <div><b>Address:</b> {active.address}</div>
              <div><b>Phone:</b> {active.phone}</div>
              <div><b>Delivery:</b> {active.deliveryTime}</div>
              <div><b>Subtotal:</b> ${Number(active.subtotal ?? 0).toFixed(2)}</div>
            </div>

            <div className="max-h-72 overflow-auto rounded border">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Item</Th>
                    <Th>Qty</Th>
                    <Th>Price</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {active.items?.map((it, idx) => (
                    <tr key={idx}>
                      <Td>
                        <div className="flex items-center gap-2">
                          {it.imgThumbURL && (
                            <img
                              src={it.imgThumbURL}
                              alt={it.title}
                              className="h-10 w-10 rounded object-cover"
                            />
                          )}
                          <span>{it.title}</span>
                        </div>
                      </Td>
                      <Td>{it.qty}</Td>
                      <Td>${Number(it.price ?? 0).toFixed(2)}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              {actionError && (
                <span className="text-sm text-red-600 mr-auto">{actionError}</span>
              )}
              <button
                className="rounded px-3 py-1.5 bg-gray-100 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Close
              </button>
              {active.status !== "handled" && (
                <button
                  className="rounded px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => markHandled(active._id)}
                >
                  Set to Handled
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
