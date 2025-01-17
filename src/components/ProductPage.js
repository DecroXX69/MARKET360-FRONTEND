import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProductRating } from '../services/api';
import styles from './ProductPage.module.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // Add current user state
  const [newProduct, setNewProduct] = useState({
    dealUrl: '',
    title: '',
    salePrice: '',
    listPrice: '',
    description: '',
    category: '',
    store: ''
  });

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Books', 
    'Sports & Outdoors', 'Toys & Games', 'Beauty', 'Automotive'
  ];

  useEffect(() => {
    fetchProducts();
    // Simulate getting current user - replace with your actual auth logic
    setCurrentUser({ _id: 'user123', name: 'Test User' });
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const data = await getProducts();
      console.log('Products received:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleLike = async (productId) => {
    try {
      if (!currentUser) {
        alert('Please login to like products');
        return;
      }

      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          const userLikedIndex = product.likes.indexOf(currentUser._id);
          const userDislikedIndex = product.dislikes.indexOf(currentUser._id);
          
          // Remove from dislikes if present
          if (userDislikedIndex !== -1) {
            product.dislikes = product.dislikes.filter(id => id !== currentUser._id);
          }

          // Toggle like
          if (userLikedIndex === -1) {
            product.likes = [...product.likes, currentUser._id];
          } else {
            product.likes = product.likes.filter(id => id !== currentUser._id);
          }
        }
        return product;
      });

      setProducts(updatedProducts);
      await updateProductRating(productId, { action: 'like', userId: currentUser._id });
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  const handleDislike = async (productId) => {
    try {
      if (!currentUser) {
        alert('Please login to dislike products');
        return;
      }

      const updatedProducts = products.map(product => {
        if (product._id === productId) {
          const userLikedIndex = product.likes.indexOf(currentUser._id);
          const userDislikedIndex = product.dislikes.indexOf(currentUser._id);
          
          // Remove from likes if present
          if (userLikedIndex !== -1) {
            product.likes = product.likes.filter(id => id !== currentUser._id);
          }

          // Toggle dislike
          if (userDislikedIndex === -1) {
            product.dislikes = [...product.dislikes, currentUser._id];
          } else {
            product.dislikes = product.dislikes.filter(id => id !== currentUser._id);
          }
        }
        return product;
      });

      setProducts(updatedProducts);
      await updateProductRating(productId, { action: 'dislike', userId: currentUser._id });
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct);
      setShowModal(false);
      setNewProduct({
        dealUrl: '',
        title: '',
        salePrice: '',
        listPrice: '',
        description: '',
        category: '',
        store: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  // Rest of your component remains the same...
  return (
    <div className={styles.container}>
      <button 
        className={styles.listButton}
        onClick={() => setShowModal(true)}
      >
        List a Product
      </button>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Add New Deal</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="url"
                placeholder="Deal URL"
                value={newProduct.dealUrl}
                onChange={(e) => setNewProduct({ ...newProduct, dealUrl: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Deal Title"
                value={newProduct.title}
                onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Sale Price"
                value={newProduct.salePrice}
                onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="List Price"
                value={newProduct.listPrice}
                onChange={(e) => setNewProduct({ ...newProduct, listPrice: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Store (e.g., Amazon, Flipkart)"
                value={newProduct.store}
                onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                required
              />
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>
                  Submit New Deal
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.productsGrid}>
        {products.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.productImage}>
              <img src="/placeholder-product.jpg" alt={product.title} />
            </div>
            <div className={styles.productInfo}>
              <h3>{product.title}</h3>
              <div className={styles.priceInfo}>
                <span className={styles.salePrice}>${product.salePrice}</span>
                <span className={styles.listPrice}>${product.listPrice}</span>
                <span className={styles.discount}>
                  {Math.round(((product.listPrice - product.salePrice) / product.listPrice) * 100)}% OFF
                </span>
              </div>
              <p className={styles.store}>From: {product.store}</p>
              <div className={styles.actions}>
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer" className={styles.dealLink}>
                  View Deal
                </a>
                <div className={styles.ratingButtons}>
                  <button 
                    onClick={() => handleLike(product._id)} 
                    className={`${styles.likeButton} ${product.likes?.includes(currentUser?._id) ? styles.active : ''}`}
                  >
                    👍 {product.likes?.length || 0}
                  </button>
                  <button 
                    onClick={() => handleDislike(product._id)}
                    className={`${styles.dislikeButton} ${product.dislikes?.includes(currentUser?._id) ? styles.active : ''}`}
                  >
                    👎 {product.dislikes?.length || 0}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;