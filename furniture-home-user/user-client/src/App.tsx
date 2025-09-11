import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Contact from "./pages/Contact";
import Account from "./pages/Account";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/account" element={<Account />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}
