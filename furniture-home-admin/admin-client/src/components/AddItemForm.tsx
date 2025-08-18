import { useState, useEffect } from "react";
import axios from "axios";

const AddItemForm = ({
  room,
  section,
  onSuccess,
  item,
}: {
  room: string;
  section: string;
  onSuccess: () => void;
  item?: {
    _id?: string;
    title: string;
    price: number;
    imgURL: string;
  };
}) => {
  const [form, setForm] = useState({
    title: "",
    price: "",
    imgURL: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title || "",
        price: item.price.toString() || "",
        imgURL: item.imgURL || "",
      });
    }
  }, [item]);

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
      imgURL: form.imgURL,
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
        {item ? "Update Item" : "Add Item"}
      </button>
    </form>
  );
};

export default AddItemForm;
