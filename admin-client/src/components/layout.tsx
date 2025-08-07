import Sidebar from './sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-60 bg-slate-800 text-white"/>
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
