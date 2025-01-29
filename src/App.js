import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import ProductDescription from './components/ProductDescription';
import './index.css';
import Navbar from './components/Navbar';

const App = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      setCurrentUser({ _id: 'user123', name: 'Test User' });
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
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar 
        handlePostDeal={handlePostDeal}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<ProductPage 
          showModal={showProductModal} 
          setShowModal={setShowProductModal}
          isAuthenticated={isAuthenticated}/>} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/products" element={<ProductPage showModal={showProductModal} 
                  setShowModal={setShowProductModal}
                  isAuthenticated={isAuthenticated}/>} />
          <Route
            path="/products/:id"
            element={<ProductDescription currentUser={currentUser} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;