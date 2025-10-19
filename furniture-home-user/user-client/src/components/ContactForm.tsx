import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function ContactForm() {
  const { user, loading } = useAuth();

  const isLoggedIn = !!user;
  const derivedName =
    user?.displayName ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : "");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    appointment: false,
  });

  // when auth status loads, prefill name/email if logged in
  useEffect(() => {
    if (!loading && isLoggedIn) {
      setForm((f) => ({
        ...f,
        name: derivedName || f.name,
        email: user?.email || f.email,
      }));
    }
  }, [loading, isLoggedIn, derivedName, user?.email]);

  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) {
  const target = e.target as HTMLInputElement;
  const { name, value, type } = target;
  const checked = target.type === "checkbox" ? target.checked : undefined;

  setForm((f) => ({
    ...f,
    [name]: type === "checkbox" ? checked : value,
  }));
}


  return (
    <>
      <h1 className="max-w-md mb-2 mx-auto py-1 text-center font-serif text-2xl font-semibold text-stone-800 bg-orange-50 px-2 rounded">
        Fill The Form Below To Be Contacted By Our Professionals
      </h1>

      <form
        id="contact-form"
        className="space-y-4 max-w-md mx-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          required
          value={form.name}
          onChange={isLoggedIn ? undefined : handleChange}
          readOnly={isLoggedIn}
          className={`w-full rounded-lg border px-3 py-2 transition outline-none
            ${isLoggedIn
              ? "bg-stone-100 text-stone-700 border-stone-300"
              : "bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200"}`}
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={isLoggedIn ? undefined : handleChange}
          readOnly={isLoggedIn}
          className={`w-full rounded-lg border px-3 py-2 transition outline-none
            ${isLoggedIn
              ? "bg-stone-100 text-stone-700 border-stone-300"
              : "bg-stone-50 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200"}`}
        />

        {/* Phone (always editable) */}
        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        {/* Message (always editable) */}
        <textarea
          name="message"
          placeholder="Message"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
          className="w-full resize-y rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            name="appointment"
            type="checkbox"
            checked={form.appointment}
            onChange={handleChange}
            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          Request an appointment
        </label>

        {/* if you need the values available to a non-React submitter,
            the form inputs already carry them; no need for hidden fields */}
      </form>
    </>
  );
}
