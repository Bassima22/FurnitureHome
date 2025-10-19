import { useNavigate } from "react-router-dom";

import ContactForm from "../components/ContactForm";
import SubmitContactButton from "../components/SubmitButton";

export default function Contact() {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/contactBg.jpg')" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-orange-50 hover:bg-gray-50"
        >
          ← Back
        </button>
      </div>
      <ContactForm />
      <SubmitContactButton apiBase="http://localhost:5051" />
      
    </div>
  );
}
