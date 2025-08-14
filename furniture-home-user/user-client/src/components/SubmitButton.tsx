import React, { useState } from "react";

type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  appointment: boolean;
};

type Props = {
  apiBase: string;      // e.g. "http://localhost:3000"
  formId?: string;      // defaults to "contact-form"
  buttonText?: string;
};

export default function SubmitContactButton({
  apiBase,
  formId = "contact-form",
  buttonText = "Send",
}: Readonly<Props>) {
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) {
      setError("Form not found.");
      return;
    }

    const fd = new FormData(form);

    // Helpers to safely read strings from FormData
    const getStr = (key: string) => {
      const v = fd.get(key);
      return typeof v === "string" ? v : "";
    };
    const getOptStr = (key: string) => {
      const v = fd.get(key);
      return typeof v === "string" ? v.trim() : undefined;
    };

    // Build a properly typed payload (no mutation of FormDataEntryValue)
    const payload: ContactPayload = {
      name: getStr("name").trim(),
      email: getStr("email").trim(),
      phone: (() => {
        const p = getOptStr("phone");
        return p && p.length > 0 ? p : undefined;
      })(),
      message: getStr("message").trim(),
      // Checkbox may be "true" | "on" | undefined depending on your input; normalize to boolean
      appointment: (() => {
        const v = fd.get("appointment");
        return v === "true" || v === "on" || v === "1" ;
      })(),
    };

    // Client-side required checks (optional but nice UX)
    if (!payload.name)   return setError("Please enter your name.");
    if (!payload.email)  return setError("Please enter your email.");
    if (!payload.message) return setError("Please enter a message.");

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      setSuccess(true);
      form.reset();
    } catch (err: unknown) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading}
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Sending..." : buttonText}
      </button>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">Message sent!</p>}
    </div>
  );
}
