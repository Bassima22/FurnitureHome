import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import Kitchen from '../pages/Kitchen';
import Bedroom from '../pages/Bedroom';
import LivingRoom from '../pages/LivingRoom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout'
import Orders from '../pages/Orders';

const AdminRoutes = () => {
  const { logged } = useAuth();

  return (
   <Routes>
  {/* Public Route: Login */}
  <Route path="/login" element={!logged ? <Login /> : <Navigate to="/home" />} />

  {/* Protected Routes */}
  <Route path="/" element={logged ? <Layout /> : <Navigate to="/login" />}>
    <Route path="home" element={<Home />} />
    <Route path="kitchen" element={<Kitchen />} />
    <Route path="bedroom" element={<Bedroom />} />
    <Route path="livingRoom" element={<LivingRoom />} />
    <Route path="/orders" element={<Orders />} />
  </Route>

  {/* Catch-all: Redirect to login or home */}
  <Route path="*" element={<Navigate to={logged ? "/home" : "/login"} />} />
</Routes>
  )
};

export default AdminRoutes;
