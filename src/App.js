// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import ProductPage from './components/ProductPage';
import './index.css';
import Navbar from './components/Navbar';

const App = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    console.log('Is authenticated:', isAuthenticated);

    return ( <
        Router >
        <div className = "app-container" > {
            /* <Routes>
                      <Route 
                        path="/" 
                        element={isAuthenticated ? <Navigate to="/products" /> : <Navigate to="/auth" />} 
                      />
                      <Route 
                        path="/auth" 
                        element={!isAuthenticated ? <AuthPage /> : <Navigate to="/products" />} 
                      />
                      <Route 
                        path="/products" 
                        element={isAuthenticated ? <ProductPage /> : <Navigate to="/auth" />} 
                      />
                    </Routes> */

                    /*<ProductPage/>*/
        } 
        
        
        <Navbar/>
        </div> </Router >
    );
};

export default App;