type Item={
    _id:string;
    title:string;
    price:number;
    imgURL:string;
}
const ItemTable = ({ items }: { items: Item[] }) => {
  return (
    <table className="w-full mb-4 border text-sm">
      <thead>
        <tr className="bg-gray-200 text-left">
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
              <button className="text-blue-500 hover:underline mr-2">Edit</button>
              <button className="text-red-500 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ItemTable;
