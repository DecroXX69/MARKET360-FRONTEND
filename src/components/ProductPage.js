import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProductRating } from '../services/api';
import styles from './ProductPage.module.css';
import ProductFilter from './ProductFilter';
import { Link } from 'react-router-dom';

const initialPriceRange = { min: 0, max: 1000 };

const ProductPage = ({ showModal, setShowModal }) => {
  const [products, setProducts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Memoize fetchProducts function
  const fetchProducts = useCallback(async (filters) => {
    try {
      const queryFilters = {
        categories: filters.selectedCategories?.length > 0 ? 
          filters.selectedCategories.join(',') : undefined,
        min: undefined,
        max: undefined,
      };

      const { min, max } = filters.priceRange;
      if (min !== initialPriceRange.min || max !== initialPriceRange.max) {
        queryFilters.min = min;
        queryFilters.max = max;
      }

      const data = await getProducts(queryFilters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  // Set currentUser on mount
  useEffect(() => {
    setCurrentUser({ _id: 'user123', name: 'Test User' });
  }, []);

  // Fetch products when filters or fetchProducts change
  useEffect(() => {
    fetchProducts({ priceRange, selectedCategories });
  }, [priceRange, selectedCategories, fetchProducts]);

  const handleFilterUpdate = useCallback((newPriceRange, newSelectedCategories) => {
    setPriceRange(newPriceRange);
    setSelectedCategories(newSelectedCategories);
    fetchProducts({ priceRange: newPriceRange, selectedCategories: newSelectedCategories });
  }, [fetchProducts]);

  const handleLike = useCallback(async (productId) => {
    try {
      if (!currentUser) {
        alert('Please login to like products');
        return;
      }

      const response = await updateProductRating(productId, {
        action: 'like',
        userId: currentUser._id
      });

      setProducts(products.map(product => {
        if (product._id === productId) {
          return {
            ...product,
            likes: response.userLiked 
              ? [...(product.likes || []), currentUser._id]
              : product.likes.filter(id => id !== currentUser._id),
            dislikes: response.userDisliked 
              ? [...(product.dislikes || []), currentUser._id]
              : product.dislikes.filter(id => id !== currentUser._id)
          };
        }
        return product;
      }));
    } catch (error) {
      console.error('Error updating like:', error);
      alert('Failed to update like status. Please try again.');
    }
  }, [currentUser, products]);

  const handleDislike = useCallback(async (productId) => {
    try {
      if (!currentUser) {
        alert('Please login to dislike products');
        return;
      }

      const response = await updateProductRating(productId, {
        action: 'dislike',
        userId: currentUser._id
      });

      setProducts(products.map(product => {
        if (product._id === productId) {
          return {
            ...product,
            likes: response.userLiked 
              ? [...(product.likes || []), currentUser._id]
              : product.likes.filter(id => id !== currentUser._id),
            dislikes: response.userDisliked 
              ? [...(product.dislikes || []), currentUser._id]
              : product.dislikes.filter(id => id !== currentUser._id)
          };
        }
        return product;
      }));
    } catch (error) {
      console.error('Error updating dislike:', error);
    }
  }, [currentUser, products]);

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
      await fetchProducts({ priceRange, selectedCategories });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.contentWrapper}>
        <div className={styles.filterSidebar}>
          <ProductFilter 
            categories={categories}
            onFilterUpdate={handleFilterUpdate}
          />
        </div>
      </div>
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
                <Link
                  to={`/products/${product._id}`}
                  className={styles.viewDetailsButton}
                >
                  View Details
                </Link>
                <a
                  href={product.dealUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.dealLink}
                >
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