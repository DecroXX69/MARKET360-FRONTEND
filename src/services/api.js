// services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000/api'
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth services
export const signIn = async(email, password) => {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
};

export const signUp = async(email, password, username, confirmPassword) => {
    const response = await api.post('/auth/signup', { email, password, username, confirmPassword });
    return response.data;
};

export const signOut = async() => {
    const response = await api.post('/auth/signout');
    localStorage.removeItem('token');
    return response.data;
};

// Product services
export const getProducts = async() => {
    try {
        console.log('Making API call to:', `${api.defaults.baseURL}/products`);
        const response = await api.get('/products');
        console.log('API response:', response);
        return response.data;
    } catch (error) {
        console.error('API error:', error);
        throw error;
    }
};

export const createProduct = async(productData) => {
    const response = await api.post('/products', productData);
    return response.data;
};

export const toggleLike = async(productId) => {
    const response = await api.post(`/products/${productId}/like`);
    return response.data;
};

export const toggleDislike = async(productId) => {
    const response = await api.post(`/products/${productId}/dislike`);
    return response.data;
};

export const updateProductRating = async (productId, { action, userId }) => {
    try {
        const response = await api.post(`/products/${productId}/rating`, {
            action,
            userId
        });
        return response.data;
    } catch (error) {
        console.error('Error in updateProductRating:', error);
        throw error;
    }
};

export default api;