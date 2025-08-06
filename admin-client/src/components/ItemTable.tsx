import { FaTrash, FaEdit } from "react-icons/fa";
type Item = {
  _id: string;
  title: string;
  price: number;
  imgURL: string;
};
const ItemTable = ({
  items,
  onDelete,
}: {
  items: Item[];
  onDelete: (id: string) => void;
}) => {
  return (
    <table className="w-full mb-4 border text-sm">
      <thead>
        <tr className=" text-left">
          <th className="p-2">ID</th>
          <th className="p-2">Title</th>
          <th className="p-2">Price</th>
          <th className="p-2">Image</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id} className="border-t">
            <td className="p-2">{item._id}</td>
            <td className="p-2">{item.title}</td>
            <td className="p-2">${item.price}</td>
            <td className="p-2">
              <img
                src={item.imgURL}
                alt={item.title}
                className="w-12 h-12 object-cover rounded"
              />
            </td>
            <td className="p-2">
              <button title="edit" className="mr-2 ml-1">
                <FaEdit size={16} color="grey" />
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this item?")
                  ) {
                    onDelete(item._id);
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
  );
};

export default ItemTable;
