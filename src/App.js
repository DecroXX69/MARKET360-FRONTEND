import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import './index.css';
import Navbar from './components/Navbar';

const App = () => {
  const [showProductModal, setShowProductModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Handler for Post a Deal button
  const handlePostDeal = () => {
    if (!isAuthenticated) {
      // Use navigate instead of window.location
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
      <div>
        <Navbar 
          handlePostDeal={handlePostDeal} // Changed from onPostDeal to handlePostDeal
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout} // Changed from onLogout to handleLogout
        />
        <div className="app-container">
          <Routes>
            <Route 
              path="/" 
              element={
                <ProductPage 
                  showModal={showProductModal} 
                  setShowModal={setShowProductModal}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/products" 
              element={
                <ProductPage 
                  showModal={showProductModal} 
                  setShowModal={setShowProductModal}
                  isAuthenticated={isAuthenticated}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;