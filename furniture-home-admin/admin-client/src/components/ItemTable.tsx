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

const ItemTable = ({
  items,
  onDelete,
  onEdit,
}: {
  items: Item[];
  onDelete: (id: string) => void;
  onEdit?: (item: Item) => void;
}) => {
  return (
    <div className="max-h-[200px] overflow-y-auto border">
      <table className="w-full mb-4 border text-sm border-gray-400">
        <thead>
          <tr className=" text-left border-b border-gray-400">
            <th className="p-2">ID</th>
            <th className="p-2">Title</th>
            <th className="p-2">Price</th>
            <th className="p-2">Image</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400">
          {items.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-2">{item._id}</td>
              <td className="p-2">{item.title}</td>
              <td className="p-2">${item.price}</td>
              <td className="p-2">
                <img
                  src={item.imgThumbURL || item.imgURL}
                  alt={item.title}
                  loading="lazy"
                  className="w-12 h-12 object-cover rounded"
                />
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
                    const confirmDelete = window.confirm(
                      "Are you sure you want to delete this item?"
                    );
                    if (confirmDelete) {
                      console.log("Delete confirmed for:", item._id);
                      onDelete(item._id);
                    } else {
                      console.log("Delete canceled for:", item._id);
                    }
                  }}
                  title="Delete"
                >
                  <FaTrash size={16} color="black" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
