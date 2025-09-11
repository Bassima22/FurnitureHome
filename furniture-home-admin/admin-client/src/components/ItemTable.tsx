import { useEffect, useRef, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

type Item = {
  _id: string;
  title: string;
  price: number;
  imgURL: string;
  imgThumbURL?: string;
  room: string;
  section: string;
};

export default function ItemTable({
  items,
  onDelete,
  onEdit,
}: Readonly<{
  items: Item[];
  onDelete: (id: string) => void;
  onEdit?: (item: Item) => void;
}>) {
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close the dialog in sync with preview state
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (preview && !d.open) d.showModal();
    if (!preview && d.open) d.close();
  }, [preview]);

  // When user presses Esc or dialog closes by any means, clear preview
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    const onClose = () => setPreview(null);
    d.addEventListener("close", onClose);
    d.addEventListener("cancel", onClose);
    return () => {
      d.removeEventListener("close", onClose);
      d.removeEventListener("cancel", onClose);
    };
  }, []);

  return (
    <>
      <div className="max-h-[200px] overflow-y-auto border">
        <table className="w-full mb-4 border text-sm border-gray-400">
          <thead>
            <tr className="text-left border-b border-gray-400">
              <th className="p-2">ID</th>
              <th className="p-2">Title</th>
              <th className="p-2">Price</th>
              <th className="p-2">Image</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-400">
            {items.map((item) => {
              const thumb = item.imgThumbURL || item.imgURL;
              const full = item.imgURL || item.imgThumbURL || "/placeholder.jpg";
              return (
                <tr key={item._id} className="border-t">
                  <td className="p-2">{item._id}</td>
                  <td className="p-2">{item.title}</td>
                  <td className="p-2">${item.price}</td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="rounded focus:outline-none focus:ring"
                      title="Click to preview"
                      onClick={() => setPreview({ src: full, alt: item.title })}
                    >
                      <img
                        src={thumb}
                        alt={item.title}
                        loading="lazy"
                        className="w-14 h-14 object-cover rounded"
                      />
                    </button>
                  </td>
                  <td className="p-2">
                    <button
                      title="Edit"
                      onClick={() => onEdit?.(item)}
                      className="mr-2 ml-1"
                    >
                      <FaEdit size={16} color="grey" />
                    </button>
                    <button
                      onClick={() => {
                        const ok = window.confirm("Are you sure you want to delete this item?");
                        if (ok) onDelete(item._id);
                      }}
                      title="Delete"
                    >
                      <FaTrash size={16} color="black" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Big, clean image modal */}
      <dialog
        ref={dialogRef}
        // full-screen canvas, transparent dialog; darkened backdrop
        className="m-0 p-0 w-screen h-screen bg-transparent backdrop:bg-black/80"
      >
        {preview && (
          <div className="relative w-full h-full flex items-center justify-center">
            <form method="dialog" className="absolute right-4 top-4">
              <button
                className="rounded-full bg-white/95 text-black w-10 h-10 shadow hover:bg-white focus:outline-none focus:ring"
                aria-label="Close"
                title="Close"
              >
                ✕
              </button>
            </form>

            <img
              src={preview.src}
              alt={preview.alt}
              // BIG: up to 95% of viewport, nice rounding & shadow
              className="max-w-[95vw] max-h-[95vh] object-contain rounded-2xl shadow-2xl bg-white"
            />
          </div>
        )}
      </dialog>
    </>
  );
}
