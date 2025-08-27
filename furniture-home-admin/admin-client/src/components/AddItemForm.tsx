import { useState, useEffect } from "react";
import axios from "axios";

// helper to resize/compress an image into a base64 data URI
async function resizeToDataURL(
  fileOrUrl: File | string,
  maxSize: number,
  mime = "image/webp",
  quality = 0.7
): Promise<string> {
  const loadImage = (src: string) =>
    new Promise<HTMLImageElement>((res, rej) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = rej;
      img.src = src;
    });

  const dataUrl =
    typeof fileOrUrl === "string"
      ? fileOrUrl
      : await new Promise<string>((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(String(r.result));
          r.onerror = reject;
          r.readAsDataURL(fileOrUrl);
        });

  const img = await loadImage(dataUrl);
  let { width, height } = img;
  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);

  return await new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (!b) return reject(new Error("toBlob failed"));
        const fr = new FileReader();
        fr.onloadend = () => resolve(fr.result as string);
        fr.readAsDataURL(b);
      },
      mime,
      quality
    );
  });
}

type ItemType = {
  _id?: string;
  title: string;
  price: number;
  imgURL: string;
  imgThumbURL?: string;
};

const AddItemForm = ({
  room,
  section,
  onSuccess,
  item,
}: {
  room: string;
  section: string;
  onSuccess: () => void;
  item?: ItemType;
}) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    imgURL: "",
    imgThumbURL: "",
  });
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        price: item.price.toString() || "",
        imgURL: item.imgURL || "",
        imgThumbURL: item.imgThumbURL || "",
      });
      setPreview(item.imgThumbURL || item.imgURL || "");
    } else {
      setPreview("");
    }
  }, [item]);

  const handleFile = async (file?: File) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      alert("Only JPG, PNG, WEBP allowed");
      return;
    }

    try {
      const imgURL = await resizeToDataURL(file, 1280, "image/webp", 0.7); // full
      const imgThumbURL = await resizeToDataURL(file, 360, "image/webp", 0.65); // thumbnail
      setForm((f) => ({ ...f, imgURL, imgThumbURL }));
      setPreview(imgThumbURL); // preview the small one
    } catch (e) {
      console.error("Image processing failed", e);
      alert("Image processing failed");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceAsNumber = Number(form.price);
    if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
      alert("Please enter a valid number for price.");
      return;
    }

    const itemToSend = {
      title: form.title,
      price: priceAsNumber,
      imgURL: form.imgURL, // full image
      imgThumbURL: form.imgThumbURL, // thumbnail
      room,
      section,
    };

    try {
      if (item?._id) {
        await axios.put(`http://localhost:5050/items/${item._id}`, itemToSend);
      } else {
        await axios.post("http://localhost:5050/items", itemToSend);
      }

      onSuccess();
    } catch (err) {
      console.error("Error saving item", err);
      alert("Failed to save item.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="w-full p-2 border rounded"
      />
      <input
        name="price"
        value={form.price}
        onChange={handleChange}
        placeholder="Price"
        className="w-full p-2 border rounded"
      />
      {/* Add Photo button + hidden input */}
      <button
        type="button"
        onClick={() => document.getElementById("photo-input")?.click()}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        Add photo
      </button>
      <input
        id="photo-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Preview */}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded border"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        {item ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
};

export default AddItemForm;
