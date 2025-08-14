 import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import CategoryNavbar from "../components/CategoryNavbar";
import ItemCard from "../components/ItemCard";
import { fetchItems } from "../lib/api";
import type { Item, Section } from "../types/Item";

export default function CategoryPage() {
  const { slug = "kitchen" } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const section = (searchParams.get("section") as Section) ?? "item";
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 16;

  useEffect(() => {
    if (!searchParams.get("section")) {
      const usp = new URLSearchParams(searchParams);
      usp.set("section", "items");
      setSearchParams(usp, { replace: true });
    }
  }, []);

  useEffect(() => {
    setPage(1);
  }, [slug, section]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchItems({ room: slug, section, page, limit });
        if (!cancelled) {
          setItems(res.items);
          setTotal(res.total);
          setHasMore(res.hasMore);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message ?? "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [slug, section, page]);

  const title = useMemo(() => slug.replace(/-/g, " "), [slug]);

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100"
      style={{
        backgroundImage: "url('/pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <CategoryNavbar />

      {/* HEADER */}
      <header className="mx-auto max-w-7xl px-4 pt-8 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-wide text-gray-900">
          {title}'s {section}
        </h1>
        <p className="text-gray-600 mt-2">
          Discover our curated selection of {title} {section}.
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-16">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={page === 1}
            >
              ← Prev
            </button>
            <span className="text-sm font-medium">
              Page {page} of {Math.ceil(total / limit)}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
              disabled={!hasMore}
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}