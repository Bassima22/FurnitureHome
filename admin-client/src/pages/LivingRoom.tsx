import Topbar from "../components/topbar";
import Section from "../components/section";
import ItemTable from "../components/ItemTable";
import AddItemButton from "../components/AddItemButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/icons/loader";
type Item = {
  _id: string;
  title: string;
  price: number;
  imgURL: string;
  room: string;
  section: string;
};
const LivingRoom = () => {
  const [galleryItems, setGalleryItems] = useState<Item[]>([]);
  const [unitItems, setUnitItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<number>(0);

  function getAndSetGalleryData() {
    setLoading((prev) => prev + 1);
    axios
      .get("http://localhost:5050/items/livingroom/gallery")
      .then((res) => setGalleryItems(res.data))
      .catch((err) => console.error("Failed to load gallery items:", err))
      .finally(() => setLoading((prev) => prev - 1));
  }

  function getAndSetLivingRoomItemsData() {
    setLoading((prev) => prev + 1);
    axios
      .get("http://localhost:5050/items/livingroom/item")
      .then((res) => setUnitItems(res.data))
      .catch((err) => console.error("Failed to load unit items:", err))
      .finally(() => setLoading((prev) => prev - 1));
  }

  useEffect(() => {
    getAndSetGalleryData();
    getAndSetLivingRoomItemsData();
  }, []);

  const handleDeleteUnit = (id: string) => {
    axios
      .delete(`http://localhost:5050/items/${id}`)
      .then(() => {
        console.log("delete item");
        getAndSetLivingRoomItemsData();
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  const handleDeleteGallery = (id: string) => {
    axios
      .delete(`http://localhost:5050/items/${id}`)
      .then(() => {
        console.log("delete item");
        getAndSetGalleryData();
    
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  const handleAddGalleryItem = () => alert("Add gallery item clicked");
  const handleAddUnitItem = () => alert("Add unit item clicked");

  return (
    <div className="p-4 relative">
      {!!loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-400 opacity-20"></div>
          <div className="z-10">
            <Loader />
          </div>
        </div>
      )}
      <Topbar text="Living Rooms' Data" />

      <div className="flex flex-col gap-4">
        <Section title="Gallery">
          <ItemTable items={galleryItems} onDelete={handleDeleteGallery} />
          <AddItemButton onClick={handleAddGalleryItem} />
        </Section>

        <Section title="Items">
          <ItemTable items={unitItems} onDelete={handleDeleteUnit} />
          <AddItemButton onClick={handleAddUnitItem} />
        </Section>
      </div>
    </div>
  );
};

export default LivingRoom;
