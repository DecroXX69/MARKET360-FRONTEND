import axios from 'axios';

// Initialize Axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:5000/api',
    timeout: 10000,
});

// Flag to prevent infinite logout loops
let isLoggingOut = false;

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
    // Only handle 401 errors if we're not already logging out and it's not a sign-in attempt
    if (error.response?.status === 401 && 
        !isLoggingOut && 
        !error.config.url.includes('/auth/signin')) {
        
        isLoggingOut = true;
        try {
            await signOut();
            window.location.reload();
        } finally {
            isLoggingOut = false;
        }
    }
    return Promise.reject(error);
});

// Authentication Services
export const signIn = async (email, password) => {
    try {
        const response = await api.post('/auth/signin', { email, password });
        return response.data;
    } catch (error) {
        // Handle 401 explicitly for signin
        if (error.response?.status === 401) {
            throw new Error('Invalid email or password');
        }
        throw new Error(error.response?.data?.message || 'An error occurred during sign in');
    }
};

export const signUp = async (email, password, username, confirmPassword) => {
    try {
        const response = await api.post('/auth/signup', { email, password, username, confirmPassword });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'An error occurred during sign up');
    }
};

export const signOut = async () => {
    try {
        const response = await api.post('/auth/signout');
        localStorage.removeItem('token');
        return response.data;
    } catch (error) {
        // Just remove the token even if the API call fails
        localStorage.removeItem('token');
        return { message: 'Signed out locally' };
    }
};

// Product Services
export const getProducts = async (filters) => {
    try {
        console.log('Full Filters Object:', filters);

        const queryParams = {
            ...(filters.categories && filters.categories.length > 0 
                ? { categories: filters.categories } 
                : {}),
            ...(filters.priceRange && filters.priceRange.min !== undefined 
                ? { min: filters.priceRange.min } 
                : {}),
            ...(filters.priceRange && filters.priceRange.max !== undefined 
                ? { max: filters.priceRange.max } 
                : {})
        };

        console.log('Prepared Query Params:', queryParams);

        const response = await api.get('/products', { 
            params: queryParams
        });
        
        console.log('Filtered Products:', response.data);
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