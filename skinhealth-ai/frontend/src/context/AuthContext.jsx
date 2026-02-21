import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/auth/profile');
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem('access_token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      await fetchProfile();
      toast.success('Logged in');
      return res.data.role;
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/auth/register', userData);
      toast.success('Registration successful! Please login.');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};