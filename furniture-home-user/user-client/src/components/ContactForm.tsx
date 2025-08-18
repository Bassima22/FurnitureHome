export default function ContactForm() {
  return (
    <>
      <h1 className="max-w-md  mb-2 mx-auto py-1 text-center font-serif text-2xl font-semibold text-stone-800 bg-orange-50 px-2 rounded">
        Fill The Form Below To Be Contacted By Our Professionals
      </h1>

      <form
        id="contact-form"
        className="space-y-4 max-w-md mx-auto rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
      >
       
        <input
          name="name"
          placeholder="Name"
          required
          className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone number"
          required
          className="w-full rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        <textarea
          name="message"
          placeholder="Message"
          required
          rows={4}
          className="w-full resize-y rounded-lg border border-stone-300 bg-stone-50 px-3 py-2 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 outline-none transition"
        />

        <label className="flex items-center gap-2 text-sm text-stone-700">
          <input
            name="appointment"
            type="checkbox"
            value="true"
            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
          />
          Request an appointment
        </label>
      </form>
    </>
  );
}
