import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { setLogged } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5050/api/auth/login', form);
      if (res.data.success) {
        setLogged(true);
      } else {
        alert("Wrong credentials");
      }
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        
        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
        <input
          name="email"
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
        <input
          name="password"
          type="password"
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
