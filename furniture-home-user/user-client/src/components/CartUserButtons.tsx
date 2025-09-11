// src/components/CartUserButtons.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

type Props = { cartCount?: number };

export default function CartUserButtons({ cartCount = 0 }: Readonly<Props>) {
  const { user, logout, loading } = useAuth();
  const nav = useNavigate();

  const isLoggedIn = !!user;

  function onLogout() {
    logout();
    nav("/"); // optional: send them home
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        to="/cart"
        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur flex items-center gap-1"
        title="Cart"
      >
        {/* cart icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
             className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6h15l-1.5 9h-12L6 6Z" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
        {cartCount > 0 && <span>{cartCount}</span>}
      </Link>

      {/* while checking token, show neutral button to avoid flicker */}
      {loading ? (
        <span className="rounded-xl border px-3 py-1.5 text-sm opacity-60">…</span>
      ) : isLoggedIn ? (
        <div className="flex items-center gap-2">
          <Link
            to="/account"
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur"
            title="Account"
          >
            {user?.email?.split("@")[0] || "user"}
          </Link>
          <button
            onClick={onLogout}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur"
            title="Log out"
          >
            logout
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur"
        >
          login
        </Link>
      )}
    </div>
  );
}
