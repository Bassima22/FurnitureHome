const AddItemButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="border border-red-400 text-red-500 px-4 py-1 rounded hover:bg-red-50"
  >
    Add Item
  </button>
);

export default AddItemButton;
