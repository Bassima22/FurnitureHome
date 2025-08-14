// src/components/ItemCard.tsx
import type { Item } from "../types/Item";

type Props = {
  item: Item;
  onAddToCart?: (item: Item) => void;
};

export default function ItemCard({ item, onAddToCart }: Readonly<Props>) {
  const imgSrc = item.imgURL?.startsWith("http")
    ? item.imgURL
    : item.imgURL || "/placeholder.jpg";

  return (
    <div className="group rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-3 flex flex-col">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <img
          src={imgSrc}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-[1.02] transition"
          loading="lazy"
        />
      </div>

      <div className="mt-3 flex-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</h3>
        {/* Only show price if > 0 (gallery items can be 0) */}
        {item.price > 0 && (
          <p className="mt-1 text-sm text-gray-600">${item.price.toLocaleString()}</p>
        )}
      </div>

      <button
        onClick={() => onAddToCart?.(item)}
        className="mt-3 inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Add to cart
      </button>
    </div>
  );
}
