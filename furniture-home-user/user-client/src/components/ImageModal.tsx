import { useEffect } from "react";

export default function ImageModal({
  open,
  onClose,
  src,
  title,
  loading = false,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  src?: string;
  title?: string;
  loading?: boolean;
}>) {
  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      {/* content */}
      <div className="relative z-10 w-[90vw] max-w-4xl rounded-xl bg-white p-3 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-center min-h-[240px] bg-gray-50 rounded-lg overflow-hidden">
          {loading ? (
            <div className="animate-pulse h-64 w-full" />
          ) : (
            <img
              src={src}
              alt={title}
              className="max-h-[70vh] w-auto object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}
