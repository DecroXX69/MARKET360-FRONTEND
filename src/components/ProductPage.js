import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, toggleDislike, toggleLike } from '../services/api';
import styles from './ProductPage.module.css';
import ProductFilter from './ProductFilter';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getWishlist, addToWishlist, removeFromWishlist } from '../services/api';
import { FaShare } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const initialPriceRange = { min: 0, max: 1000 };

const ProductPage = ({ showModal, setShowModal }) => {
  const [products, setProducts] = useState([]);
  const [currentUser] = useState({ _id: 'user123', name: 'Test User' });
  const [newProduct, setNewProduct] = useState({
    dealUrl: '',
    title: '',
    salePrice: '',
    listPrice: '',
    description: '',
    category: '',
    store: '',
    images: []
  });
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Books', 
    'Sports & Outdoors', 'Toys & Games', 'Beauty', 'Automotive'
  ];

  // State for filtering
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000 },
    categories: []
  });
  const [wishlistedProducts, setWishlistedProducts] = useState(new Set());

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistItems = await getWishlist();
        const wishlistProductIds = new Set(wishlistItems.map(product => product._id));
        setWishlistedProducts(wishlistProductIds);
      } catch (error) {
        toast.error('Failed to fetch wishlist');
      }
    };

    fetchWishlist();
  }, []);

  const handleWishlistToggle = async (productId) => {
    try {
      if (wishlistedProducts.has(productId)) {
        await removeFromWishlist(productId);
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
        toast.success('Product removed from wishlist');
      } else {
        await addToWishlist(productId);
        setWishlistedProducts(prev => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
        toast.success('Product added to wishlist');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts({});
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        toast.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let result = products.filter((product) => 
        product.salePrice >= filters.priceRange.min && 
        product.salePrice <= filters.priceRange.max
      );
      if (filters.categories.length > 0) {
        result = result.filter(product => filters.categories.includes(product.category));
      }
      setFilteredProducts(result);
    };
    applyFilters();
  }, [filters, products]);

  const handleFilterUpdate = (newFilters) => {
    setFilters(newFilters);
  };

  const handleLike = useCallback(async (productId) => {
    try {
      if (!currentUser) return toast.error('Please log in');
      const { likeCount, dislikeCount } = await toggleLike(productId, {
        action: 'like',
        userId: currentUser._id
      });
      setProducts(products.map(product => 
        product._id === productId 
          ? { ...product, likeCount, dislikeCount } 
          : product
      ));
    } catch (error) {
      toast.error('Failed to update like status');
    }
  }, [currentUser, products]);

  const handleDislike = useCallback(async (productId) => {
    try {
      if (!currentUser) return toast.error('Please log in');
      const { likeCount, dislikeCount } = await toggleDislike(productId, {
        action: 'dislike',
        userId: currentUser._id
      });
      setProducts(products.map(product => 
        product._id === productId 
          ? { ...product, likeCount, dislikeCount } 
          : product
      ));
    } catch (error) {
      toast.error('Failed to update dislike status');
    }
  }, [currentUser, products]);

  const handleShareProduct = async (productId) => {
    const shareUrl = `${window.location.origin}/products/${productId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      const tempInput = document.createElement('input');
      document.body.appendChild(tempInput);
      tempInput.value = shareUrl;
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    toast.success('Link copied to clipboard');
  };

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const createPreviews = [];
    const addImages = [];
    
    files.forEach(file => {
      if (file.size > 5e6) {
        toast.error('Image exceeds 5MB limit');
        return;
      }
      addImages.push(file);
      createPreviews.push(URL.createObjectURL(file));
    });

    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, ...addImages]
    }));
    setImagesPreview(prev => [...prev, ...createPreviews]);
  }, []);

  const removeImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(imagesPreview[index]);
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(newProduct).forEach(key => {
      if (key === 'images') return;
      formData.append(key, newProduct[key]);
    });

    newProduct.images.forEach(file => {
      formData.append('images[]', file);
    });

    try {
      await createProduct(formData);
      toast.success('Product added successfully');
      setShowModal(false);
      setNewProduct({
        dealUrl: '',
        title: '',
        salePrice: '',
        listPrice: '',
        description: '',
        category: '',
        store: '',
        images: []
      });
      setImagesPreview([]);

      // Refresh products
      const updatedProducts = await getProducts({});
      setProducts(updatedProducts);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
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
                placeholder="Store"
                value={newProduct.store}
                onChange={(e) => setNewProduct({ ...newProduct, store: e.target.value })}
                required
              />
              <div className={styles.imageUploadSection}>
                <div className={styles.imagesPreviewContainer}>
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className={styles.imagePreviewItem}>
                      <div className={styles.previewContainer}>
                        <img 
                          src={preview} 
                          alt={`Preview ${index}`} 
                          className={styles.imagePreview} 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className={styles.removeImage}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {newProduct.images.length < 10 && (
                  <div className={styles.uploadContainer}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      id="dealImage"
                      className={styles.fileInput}
                    />
                    <label htmlFor="dealImage" className={styles.uploadLabel}>
                      🖼️ Add More Images
                    </label>
                  </div>
                )}
              </div>
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton} disabled={loading}>
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
            initialFilters={filters}
          />
        </div>
        <div className={styles.productsGrid}>
          {filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.productImage}>
                {/* Heart Button */}
                <button
                   className={styles.heartButton}
                   onClick={() => handleWishlistToggle(product._id)}>
                   {wishlistedProducts.has(product._id) ?   <CiHeart />: <FaHeart /> }
                   
                </button>
                {/* Heart Button End    '❤️' '♡'*/}
                {/* Share button start */}
                <button onClick={() => handleShareProduct(product._id)} className={styles.shareButton}>
                <FaShare />

                  </button>
                  {/* share button end */}

                {product.images && product.images[0] ? (
                  <img src={product.images[0].url} alt={product.title} />
                ) : (
                  <img src="/placeholder-image.jpg" alt={product.title} />
                )}
                
              </div>
              
              <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <div className={styles.priceInfo}>
                  <span className={styles.salePrice}>${product.salePrice}</span>
                  <span className={styles.listPrice}>${product.listPrice}</span>
                  <span className={styles.discount}>
                    {Math.round(100 - (product.salePrice / product.listPrice) * 100)}% OFF
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
    {/* heart button place */}
  {/* Share button place */}
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
                      className={`${styles.likeButton} ${product.userLikes ? styles.active : ''}`}
                    >
                      👍 {product.likeCount}
                    </button>
                    <button 
                      onClick={() => handleDislike(product._id)}
                      className={`${styles.dislikeButton} ${product.userDislikes ? styles.active : ''}`}
                    >
                      👎 {product.dislikeCount}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;