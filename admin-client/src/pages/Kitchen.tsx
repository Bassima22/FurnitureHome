import Topbar from '../components/topbar';
import Section from '../components/section';
import ItemTable from '../components/ItemTable';
import AddItemButton from '../components/AddItemButton';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Kitchen = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [unitItems, setUnitItems] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:5050/items/kitchen/gallery')
    .then(res => setGalleryItems(res.data))
    .catch(err => console.error("Failed to load gallery items:", err));

  axios.get('http://localhost:5050/items/kitchen/item')
    .then(res => setUnitItems(res.data))
    .catch(err => console.error("Failed to load unit items:", err));
}, []);


  const handleAddGalleryItem = () => alert('Add gallery item clicked');
  const handleAddUnitItem = () => alert('Add unit item clicked');

  return (
    <div className="p-4">
      <Topbar text="Kitchens' Data" />
      
      <div className="flex gap-4">
        <Section title="Gallery">
          <ItemTable items={galleryItems} />
          <AddItemButton onClick={handleAddGalleryItem} />
        </Section>

        <Section title="Items">
          <ItemTable items={unitItems} />
          <AddItemButton onClick={handleAddUnitItem} />
        </Section>
      </div>
    </div>
  );
};

export default Kitchen;
