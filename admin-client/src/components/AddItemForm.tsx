import { useState } from "react";
import axios from "axios";

const AddItemForm = ({
  room,
  section,
  onSuccess,
}: {
  room: string;
  section: string;
  onSuccess: () => void;
}) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    imgURL: "",
  });

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

    const item = {
      ...form,
      price: priceAsNumber,
      room,
      section,
    };

    try {
      await axios.post("http://localhost:5050/items", item);
      onSuccess();
    } catch (err) {
      console.error("Error adding item", err);
      alert("Failed to add item.");
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
      <input
        name="imgURL"
        value={form.imgURL}
        onChange={handleChange}
        placeholder="Image URL"
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
