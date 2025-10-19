// src/components/ItemCard.tsx
import { useRef, useState } from "react";
import type { Item } from "../types/Item";

type Props = {
  item: Item;
  onAddToCart?: (item: Item) => void;
};

export default function ItemCard({ item, onAddToCart }: Readonly<Props>) {
  const imgSrc = item.imgThumbURL || item.imgURL || "/placeholder.jpg";

  // --- toast state ---
  const [toast, setToast] = useState<string | null>(null);
  const hideTimer = useRef<number | null>(null);

  function showToast(msg: string, ms = 2000) {
    setToast(msg);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setToast(null), ms);
  }

  function handleAddClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onAddToCart?.(item);
    showToast(`“${item.title}” added to cart`);
  }

  return (
    <div className="group rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-3 flex flex-col relative">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={imgSrc}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>

      <div className="mt-3 flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
          {item.title}
        </h3>

        {item.price > 0 && (
          <p className="mt-1 text-sm text-gray-600">
            ${item.price.toLocaleString()}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleAddClick}
        className="mt-3 inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Add to cart
      </button>

      {/* Toast (bottom-right of viewport). Accessible + auto-hide */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-lg border border-stone-200 bg-white/90 px-4 py-2 text-sm shadow-md backdrop-blur animate-in fade-in slide-in-from-bottom-1"
        >
          ✅ {toast}
        </div>
      )}
    </div>
  );
}
