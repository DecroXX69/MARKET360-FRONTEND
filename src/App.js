import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate as Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import ShoppingCart from './components/ShoppingCart';
import ProductDescription from './components/ProductDescription';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './components/ProfilePage';
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { themeSettings } from "./theme";
import Layout from "./AdminScenes/layout/index";
import Dashboard from "./AdminScenes/dashboard/index";
import Products from "./AdminScenes/products/index";
import Customers from "./AdminScenes/customers/index";
import Transactions from "./AdminScenes/transactions/index";
import Geography from "./AdminScenes/geography/index";
import Overview from "./AdminScenes/overview/index";
import Daily from "./AdminScenes/daily/index";
import Monthly from "./AdminScenes/monthly/index";
import Breakdown from "./AdminScenes/breakdown/index";
import Admin from "./AdminScenes/admin/index";
import Performance from "./AdminScenes/performance/index";
import Wishlist from './components/Wishlist';
import AdminPage from './components/AdminPage';
import DarkModeToggle from 'react-dark-mode-toggle';
import styles from './components/ProductPage.module.css';
const App = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);

  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.getAttribute('data-theme') === 'dark'
  );
  const handleThemeToggle = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  setIsDarkMode(newTheme === 'dark');
};


  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(userData);
    }
}, [isAuthenticated]);

  const handlePostDeal = () => {
    if (!isAuthenticated) {
      window.location.href = '/auth';
      return;
    }
    setShowProductModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Add this line
    setCurrentUser(null);
    setIsAuthenticated(false);
};

  return (
    <AuthProvider>
    <Router>
      <Navbar 
        handlePostDeal={handlePostDeal}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        currentUser={currentUser}
        onChange={handleThemeToggle}
        checked={isDarkMode}
        size={80}
        className={styles.switch}
        style={{ margin: '10px' }}
      />
      <div className="app-container">
        <Routes>

        {/* <Route element={<Layout />}>
        <Route path="/admin" element={<Navigate to="Adminscenes/dashboard" replace />} />
              <Route path="/admin/Adminscenes/dashboard" element={<Dashboard />} />
              <Route path="Adminscenes/products" element={<Products />} />
              <Route path="Adminscenes/customers" element={<Customers />} />
              <Route path="Adminscenes/transactions" element={<Transactions />} />
              <Route path="Adminscenes/geography" element={<Geography />} />
              <Route path="Adminscenes/overview" element={<Overview />} />
              <Route path="Adminscenes/daily" element={<Daily />} />
              <Route path="Adminscenes/monthly" element={<Monthly />} />
              <Route path="Adminscenes/breakdown" element={<Breakdown />} />
              <Route path="Adminscenes/admin" element={<Admin />} />
              <Route path="Adminscenes/performance" element={<Performance />} /> */}
          <Route path="/" element={<ProductPage 
          showModal={showProductModal} 
          setShowModal={setShowProductModal}
          isAuthenticated={isAuthenticated}/>} />
          <Route path="/auth" element={<AuthPage />} />
         {/* Admin Dashboard */}
         <Route path="/admin" element={<AdminPage />} />
      {/* Add more admin routes here */}
          <Route path="/products" element={<ProductPage showModal={showProductModal} 
                  setShowModal={setShowProductModal}
                  isAuthenticated={isAuthenticated}/>} />
          <Route
            path="/products/:id"
            element={<ProductDescription currentUser={currentUser} />}
          />
          <Route path="/profile" element={<UserProfile  currentUser={currentUser} isAuthenticated={isAuthenticated} />} />
          <Route path="/wishlist" element={<Wishlist  currentUser={currentUser}/>} />
        </Routes>
      </div>
      <div>
  
    </div>
      <Footer />
    </Router>
    </AuthProvider>
  );
};


export default App;