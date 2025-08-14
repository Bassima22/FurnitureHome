import CartUserButtons from "./CartUserButtons";

export default function Navbar() {
  
  const isLoggedIn = false;
  const cartCount = 0;

  return (
    <header className="w-full">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-end">
        <CartUserButtons cartCount={cartCount} isLoggedIn={isLoggedIn} />
      </div>
    </header>
  );
}
