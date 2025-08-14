import React from "react";

export default function contactForm() {
  return (
    <form id="contact-form" className="space-y-3 max-w-md mx-auto">
      <input
        name="name"
        placeholder="Name"
        required
        className="border p-2 w-full"
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="border p-2 w-full"
      />

      <input
        name="phone"
        type="tel"
        required
        placeholder="Phone number"
        className="border p-2 w-full"
      />

      <textarea
        name="message"
        placeholder="Message"
        required
        className="border p-2 w-full"
        rows={4}
      />

      <label className="flex items-center gap-2">
        <input
          name="appointment"
          type="checkbox"
          value="true"
          className="h-4 w-4"
        />
        Request an appointment
      </label>
    </form>
  );
}
