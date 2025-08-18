import { useEffect, useState, type ReactNode } from "react";

type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  appointment: boolean;
  createdAt: string;
  handled: boolean;
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
}: Readonly<
  { children: ReactNode } & React.TdHTMLAttributes<HTMLTableCellElement>
>) {
  return (
    <td className="px-4 py-3 align-top" {...rest}>
      {children}
    </td>
  );
}

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [handledContacts, setHandledContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Contact | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:5050/api/home")
      .then((res) => res.json())
      .then((data: Contact[]) => setContacts(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5050/api/home/handled")
      .then((res) => res.json())
      .then((data: Contact[]) => setHandledContacts(data));
  }, []);

  const markHandled = async (id: string) => {
    setActionError(null);

    const prevUnhandled = contacts;
    setContacts((curr) => curr.filter((c) => c._id !== id));
    setOpen(false);

    try {
      const res = await fetch(`http://localhost:5050/api/home/${id}/handled`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handled: true }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      if (active && active._id === id) {
        setHandledContacts((prev) => [{ ...active, handled: true }, ...prev]);
      }
      setActive(null);
    } catch (err) {
      setContacts(prevUnhandled);
      setOpen(true);
      const msg =
        err instanceof Error ? err.message : "Failed to mark as handled.";
      setActionError(msg);
    }
  };

  if (loading) return <div>Loading contacts...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Contacts</h1>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Message</Th>
              <Th>Appointment</Th>
              <Th>Created At</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {contacts.length === 0 ? (
              <tr>
                <Td colSpan={6}>No pending contacts.</Td>
              </tr>
            ) : (
              contacts.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <Td>{c.name || "—"}</Td>
                  <Td>
                    {c.email ? (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {c.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>{c.phone || "—"}</Td>
                  <Td>
                    {c.message ? (
                      <button
                        className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                        onClick={() => {
                          setActive(c);
                          setOpen(true);
                        }}
                      >
                        View
                      </button>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        c.appointment
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.appointment ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td>{new Date(c.createdAt).toLocaleString()}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-semibold mt-8 mb-3">Handled Messages</h2>
      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Message</Th>
              <Th>Appointment</Th>
              <Th>Created At</Th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {handledContacts.length === 0 ? (
              <tr>
                <Td colSpan={6}>No handled messages yet.</Td>
              </tr>
            ) : (
              handledContacts.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <Td>{c.name || "—"}</Td>
                  <Td>
                    {c.email ? (
                      <a
                        href={`mailto:${c.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {c.email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>{c.phone || "—"}</Td>
                  <Td>
                    {c.message ? (
                      <button
                        className="rounded border px-2 py-1 text-xs hover:bg-gray-100"
                        onClick={() => {
                          setActive(c);
                          setOpen(true);
                        }}
                      >
                        View
                      </button>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        c.appointment
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.appointment ? "Yes" : "No"}
                    </span>
                  </Td>
                  <Td>{new Date(c.createdAt).toLocaleString()}</Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded shadow p-4 max-w-lg w-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">
                Message from {active.name || "Contact"}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-black"
                aria-label="Close"
                title="Close"
              >
                X
              </button>
            </div>

            <p className="whitespace-pre-wrap break-words mb-4">
              {active.message}
            </p>

            <div className="flex items-center justify-end gap-2">
              {actionError && (
                <span className="text-sm text-red-600 mr-auto">
                  {actionError}
                </span>
              )}
              <button
                className="rounded px-3 py-1.5 bg-gray-100 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>

              {!active.handled && (
                <button
                  className="rounded px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => markHandled(active._id)}
                >
                  Handled
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
