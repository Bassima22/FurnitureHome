import { NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { Section } from "../types/Item";
import CartUserButtons from "./CartUserButtons";

const tabs: { key: Section; label: string }[] = [
  { key: "item", label: "Category Items" },
  { key: "gallery", label: "Category Gallery" },
];

export default function CategoryNavbar() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const section = (searchParams.get("section") as Section) ?? "items";
  const location = useLocation();
  const navigate = useNavigate();

  // Build the link for a given section
  const makeHref = (s: Section) => {
    const usp = new URLSearchParams(location.search);
    usp.set("section", s);
    return `/category/${slug}?${usp.toString()}`;
  };

  // Example static values (replace with actual state/context later)
  const isLoggedIn = false;
  const cartCount = 0;

  return (
    <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center rounded-full border px-3 py-1 text-sm hover:bg-gray-50"
        >
          ← Back
        </button>

        {/* Tabs */}
        <nav className="flex gap-6">
          {tabs.map((t) => (
            <NavLink
              key={t.key}
              to={makeHref(t.key)}
              className={
                section === t.key
                  ? "text-sm md:text-base pb-2 border-b-2 border-gray-900 font-semibold"
                  : "text-sm md:text-base pb-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900"
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        {/* Cart/User buttons on the right */}
        <div className="ml-auto">
          <CartUserButtons cartCount={cartCount} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </div>
  );
}
