import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ className = "" }: { className?: string }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`flex flex-col justify-between p-4 ${className}`}>
     
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/home" className="hover:underline">Contacts</Link>
          <Link to="/kitchen" className="hover:underline">Kitchen</Link>
          <Link to="/bedroom" className="hover:underline">Bedroom</Link>
          <Link to="/livingroom" className="hover:underline">Living Room</Link>
        </nav>
      </div>

     <div className='mt-auto'>
      <button
        onClick={handleLogout}
        className="mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
      </div>
    </div>
  );
};

export default Sidebar;
