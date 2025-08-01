import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Kitchen from '../pages/Kitchen';
import Bedroom from '../pages/Bedroom';
import LivingRoom from '../pages/LivingRoom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout'

const AdminRoutes = () => {
  const { logged } = useAuth();

  return (
    <Routes>
      <Route path="*" element={<Navigate to={logged ? "/home" : "/login"} />} />
      <Route path="/login" element={!logged ? <Login /> : <Navigate to="/home" />} />
       <Route path="/" element={<Layout />}>
           <Route path="/home" element={logged ? <Home /> : <Navigate to="/login" />} />
            <Route path="/kitchen" element={<Kitchen/>}/>
            <Route path="/bedroom" element={<Bedroom/>}/>
            <Route path="/livingRoom" element={<LivingRoom/>}/>
    </Route>
    </Routes>
  );
};

export default AdminRoutes;
