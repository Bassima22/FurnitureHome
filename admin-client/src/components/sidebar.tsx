import { Link } from 'react-router-dom';

const Sidebar = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`p-4 ${className}`}>
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/home" className="hover:underline">Home</Link>
        <Link to="/kitchen" className="hover:underline">Kitchen</Link>
        <Link to="/bedroom" className="hover:underline">Bedroom</Link>
        <Link to="/livingroom" className="hover:underline">Living Room</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
