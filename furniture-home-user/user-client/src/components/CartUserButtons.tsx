
import { Link } from "react-router-dom";

interface Props {
  cartCount?: number;
  isLoggedIn?: boolean;
}

export default function CartUserButtons({
  cartCount = 0,
  isLoggedIn = false,
}: Readonly<Props>) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/cart"
        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur flex items-center gap-1"
        title="Cart"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 6h15l-1.5 9h-12L6 6Z" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
        {cartCount > 0 && <span>{cartCount}</span>}
      </Link>
      <Link
        to={isLoggedIn ? "/account" : "/login"}
        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-white/70 backdrop-blur"
      >
        {isLoggedIn ? "user" : "login"}
      </Link>
    </div>
  );
}
