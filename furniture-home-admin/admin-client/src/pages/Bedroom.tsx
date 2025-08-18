import Topbar from "../components/topbar";
import Section from "../components/section";
import ItemTable from "../components/ItemTable";
import AddItemButton from "../components/AddItemButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/icons/loader";
import Modal from "../components/Modal";
import AddItemForm from "../components/AddItemForm";
type Item = {
  _id: string;
  title: string;
  price: number;
  imgURL: string;
  room: string;
  section: string;
};
const Bedroom = () => {
  const [galleryItems, setGalleryItems] = useState<Item[]>([]);
  const [unitItems, setUnitItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<number>(0);
  const [showAddGalleryModal, setShowAddGalleryModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  function getAndSetBedroomGalleryData() {
    setLoading((prev) => prev + 1);
    axios
      .get("http://localhost:5050/items/bedroom/gallery")
      .then((res) => setGalleryItems(res.data))
      .catch((err) => console.error("Failed to load gallery items:", err))
      .finally(() => setLoading((prev) => prev - 1));
  }

  function getAndSetBedroomItemsData() {
    setLoading((prev) => prev + 1);
    axios
      .get("http://localhost:5050/items/bedroom/item")
      .then((res) => setUnitItems(res.data))
      .catch((err) => console.error("Failed to load unit items:", err))
      .finally(() => setLoading((prev) => prev - 1));
  }

  useEffect(() => {
    getAndSetBedroomGalleryData();
    getAndSetBedroomItemsData();
  }, []);

  const handleDeleteUnit = (id: string) => {
    axios
      .delete(`http://localhost:5050/items/${id}`)
      .then(() => {
        console.log("delete item");
        getAndSetBedroomItemsData();
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  const handleDeleteGallery = (id: string) => {
    axios
      .delete(`http://localhost:5050/items/${id}`)
      .then(() => {
        console.log("delete item");
        getAndSetBedroomGalleryData();
      })
      .catch((err) => console.error("Failed to delete item:", err));
  };

  const handleAddGalleryItem = () => setShowAddGalleryModal(true);
  const handleAddUnitItem = () => setShowAddItemModal(true);

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
      <Topbar text="Bedrooms' Data" />
      

      <div className="flex flex-col gap-4">
        <div className="h-[45%]">
        <Section title="Gallery">
          <ItemTable
            items={galleryItems}
            onDelete={handleDeleteGallery}
            onEdit={(item) => setEditingItem(item)}
          />
          <AddItemButton onClick={handleAddGalleryItem} />
        </Section>
        </div>
        <div className="h-[45%]">
          <Section title="Items">
            <ItemTable
              items={unitItems}
              onDelete={handleDeleteUnit}
              onEdit={(item) => setEditingItem(item)}
            />
            <AddItemButton onClick={handleAddUnitItem} />
          </Section>
        </div>
      </div>

      {showAddGalleryModal && (
        <Modal onClose={() => setShowAddGalleryModal(false)}>
          <h2 className="text-lg font-semibold mb-4">Add Gallery Item</h2>
          <AddItemForm
            room="bedroom"
            section="gallery"
            onSuccess={() => {
              setShowAddGalleryModal(false);
              getAndSetBedroomGalleryData();
              window.location.reload();
            }}
          />
        </Modal>
      )}

      {showAddItemModal && (
        <Modal onClose={() => setShowAddItemModal(false)}>
          <h2 className="text-lg font-semibold mb-4">Add Item</h2>
          <AddItemForm
            room="bedroom"
            section="item"
            onSuccess={() => {
              setShowAddItemModal(false);
              getAndSetBedroomItemsData();
              window.location.reload();
            }}
          />
        </Modal>
      )}

      {editingItem && (
        <Modal onClose={() => setEditingItem(null)}>
          <h2 className="text-lg font-semibold mb-4">Edit Item</h2>
          <AddItemForm
            item={editingItem}
            room={editingItem.room}
            section={editingItem.section}
            onSuccess={() => {
              setEditingItem(null);
              if (editingItem.section === "gallery") {
                getAndSetBedroomGalleryData();
              } else {
                getAndSetBedroomItemsData();
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Bedroom;
