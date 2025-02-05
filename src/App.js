import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import ProductDescription from './components/ProductDescription';
import './index.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import UserProfile from './components/ProfilePage';
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
          <Route path="/profile" element={<UserProfile  currentUser={currentUser} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </div>
     
      <Footer />
    </Router>
    </AuthProvider>
  );
};

export default App;