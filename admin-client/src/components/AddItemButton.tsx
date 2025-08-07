const AddItemButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border bg-gray-400 border-black text-black px-4 mt-3 py-1 rounded hover:bg-red-50"
  >
    Add Item
  </button>
);

export default AddItemButton;
