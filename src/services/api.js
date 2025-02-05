import axios from 'axios';

// Initialize Axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000/api',
    timeout: 10000, // Set timeout to 10 seconds
});

// Request interceptor for authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for global error handling
api.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    if (error.response?.status === 401) {
        // Handle unauthorized errors (e.g., token expired)
        await signOut();
        window.location.reload();
    }
    return Promise.reject(error);
});

// Authentication Services
export const signIn = async (email, password) => {
    try {
        const response = await api.post('/auth/signin', { email, password });
        return response.data;
    } catch (error) {
        console.error('Sign In Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const signUp = async (email, password, username, confirmPassword) => {
    try {
        const response = await api.post('/auth/signup', { email, password, username, confirmPassword });
        return response.data;
    } catch (error) {
        console.error('Sign Up Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const signOut = async () => {
    try {
        const response = await api.post('/auth/signout');
        localStorage.removeItem('token');
        return response.data;
    } catch (error) {
        console.error('Sign Out Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

// Product Services
export const getProducts = async (filters) => {
    try {
        const response = await api.get('/products', { 
        params: {
          ...filters,
          search: filters.search // Add search parameter
        }
      });
        return response.data;
    } catch (error) {
        console.error('Get Products Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const getProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Get Product Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

// Create Product with Image Upload Support
// export const createProduct = async (productData, images) => {
//     const formData = new FormData();
//     formData.append('productData', JSON.stringify(productData));

//     if (images) {
//         images.forEach((image, index) => {
//             formData.append(`images[${index}]`, image);
//         });
//     }

//     try {
//         const response = await api.post('/products', formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Create Product Error:', error.response?.data?.message || error.message);
//         throw error;
//     }
// };
export const createProduct = async (formData) => {
    try {
        const response = await api.post('/products', formData);
        return response.data;
    } catch (error) {
        console.error('Create Product Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

// Interaction Services
export const toggleLike = async (productId) => {
    try {
        const response = await api.put(`/products/${productId}/like`);
        return response.data;
    } catch (error) {
        console.error('Toggle Like Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const toggleDislike = async (productId) => {
    try {
        const response = await api.put(`/products/${productId}/dislike`);
        return response.data;
    } catch (error) {
        console.error('Toggle Dislike Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export const updateProductRating = async (productId, { action, userId }) => {
    try {
        const response = await api.post(`/products/${productId}/rating`, {
            action,
            userId,
        });
        return response.data;
    } catch (error) {
        console.error('Update Rating Error:', error.response?.data?.message || error.message);
        throw error;
    }
};

export default api;