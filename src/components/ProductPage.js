import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProductRating, toggleDislike, toggleLike } from '../services/api';
import styles from './ProductPage.module.css';
import ProductFilter from './ProductFilter';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
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
    store: '',
    image: null // Add this for image file
  });

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Books', 
    'Sports & Outdoors', 'Toys & Games', 'Beauty', 'Automotive'
  ];

  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

      console.log('Sending like request for product:', productId);

      const response = await toggleLike(productId, {
          action: 'like',
          userId: currentUser._id
      });

      console.log('Received response:', response);

      setProducts(products.map(product => {
          if (product._id === productId) {
              return {
                ...product,
                likeCount: response.likeCount, // Update likeCount
                dislikeCount: response.dislikeCount // Update dislikeCount
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

      console.log('Sending Dislike request for product:', productId);

      const response = await toggleDislike(productId, {
        action: 'dislike',
        userId: currentUser._id
      });

      console.log('Received response:', response);

    setProducts(products.map(product => {
      if (product._id === productId) {
          return {
            ...product,
            likeCount: response.likeCount, // Update likeCount
            dislikeCount: response.dislikeCount // Update dislikeCount
        };
      }
      return product;
  }));
} catch (error) {
  console.error('Error updating dislike:', error);
  alert('Failed to update dislike status. Please try again.');
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



  const handleSaveProduct = async (productId) => {
    try {
      // Frontend-only for now
      setProducts(products.map(product => {
        if (product._id === productId) {
          return {
            ...product,
            isSaved: !product.isSaved
          };
        }
        return product;
      }));
      
      // Show feedback
      toast.success(
        products.find(p => p._id === productId).isSaved 
          ? 'Removed from saved deals' 
          : 'Added to saved deals'
      );
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };
  
  const handleShareProduct = async (productId) => {
    const shareUrl = `${window.location.origin}/products/${productId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      console.error('Error sharing product:', error);
      // Fallback
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.value = shareUrl;
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      toast.success('Link copied to clipboard!');
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
                <div className={styles.imageUploadSection}>
        {imagePreview ? (
          <div className={styles.previewContainer}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              className={styles.imagePreview} 
            />
            <button 
              type="button" 
              onClick={() => {
                setImagePreview(null);
                setNewProduct({ ...newProduct, image: null });
              }}
              className={styles.removeImage}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div className={styles.uploadContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="dealImage"
              className={styles.fileInput}
            />
            <label htmlFor="dealImage" className={styles.uploadLabel}>
              📸 Add Deal Image
            </label>
          </div>
        )}
      </div>
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
              <img src="https://sm.mashable.com/t/mashable_in/article/i/ive-review/ive-reviewed-over-59-laptops-and-this-is-the-best-windows-la_rzds.1248.jpg" alt={product.title} />
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
                {/* Add Save button */}
  <button 
    onClick={() => handleSaveProduct(product._id)}
    className={`${styles.saveButton} ${product.isSaved ? styles.saved : ''}`}
  >
    {product.isSaved ? '❤️ Saved' : '🤍 Save'}
  </button>
  
  {/* Add Share button */}
  <button 
    onClick={() => handleShareProduct(product._id)}
    className={styles.shareButton}
  >
    🔗 Share
  </button>
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
                    👍 {product.likeCount|| 0}
                  </button>
                  <button 
                    onClick={() => handleDislike(product._id)}
                    className={`${styles.dislikeButton} ${product.dislikes?.includes(currentUser?._id) ? styles.active : ''}`}
                  >
                    👎 {product.dislikeCount|| 0}
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
