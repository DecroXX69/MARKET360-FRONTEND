import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct } from '../services/api';
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
    images: []
  });
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Books', 
    'Sports & Outdoors', 'Toys & Games', 'Beauty', 'Automotive'
  ];

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const initialProduct = {
    dealUrl: '',
    title: '',
    salePrice: '',
    listPrice: '',
    description: '',
    category: '',
    store: '',
    images: []
  };
  // Set current user on mount
  useEffect(() => {
    setCurrentUser({ _id: 'user123', name: 'Test User' });
  }, []);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryFilters = {
          categories: selectedCategories.length > 0 
            ? selectedCategories.join(',') 
            : undefined,
          min: priceRange.min !== initialPriceRange.min 
            ? priceRange.min 
            : undefined,
          max: priceRange.max !== initialPriceRange.max 
            ? priceRange.max 
            : undefined,
        };

        const data = await getProducts(queryFilters);
        setProducts(Array.isArray(data) ? data : []); // Ensure products is an array
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [priceRange, selectedCategories]);

  const handleImageChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size exceeds 5MB limit');
        continue;
      }
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
    setImagesPreview(prev => [...prev, ...newPreviews]);
  }, []);

  const removeImage = useCallback((index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    URL.revokeObjectURL(imagesPreview[index]);
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
  }, [imagesPreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('dealUrl', newProduct.dealUrl);
    formData.append('title', newProduct.title);
    formData.append('salePrice', newProduct.salePrice);
    formData.append('listPrice', newProduct.listPrice);
    formData.append('description', newProduct.description);
    formData.append('category', newProduct.category);
    formData.append('store', newProduct.store);

    newProduct.images.forEach((file, index) => {
        formData.append('images[]', file); // Use array syntax for images
    });

    try {
        const response = await createProduct(formData);
        toast.success('Product created successfully');
        setShowModal(false);
        setNewProduct({ ...initialProduct });
        setImagesPreview([]);
    } catch (error) {
        console.error('Error creating product:', error);
        setUploadError(error.response?.data?.message || 'Failed to create product');
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
            <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                <h3>Product Images</h3>
                <div className={styles.imagePreviewContainer}>
                  {imagesPreview.map((preview, index) => (
                    <div key={index} className={styles.imagePreviewBox}>
                      <img src={preview} alt={`Preview ${index}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className={styles.removeImageBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
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
                    📸 Add Deal Images (Max 10)
                  </label>
                </div>
              </div>

              {loading ? (
                <div className={styles.loading}>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className={styles.modalButtons}>
                  <button
                    type="submit"
                    className={styles.submitButton}
                  
                    disabled={loading}
                  >
                    Submit New Deal
                  </button>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.filterSidebar}>
          <ProductFilter 
            categories={categories}
            onFilterUpdate={(newPriceRange, newSelectedCategories) => {
              setPriceRange(newPriceRange);
              setSelectedCategories(newSelectedCategories);
            }}
          />
        </div>
        <div className={styles.productsGrid}>
          {Array.isArray(products) && products.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <div className={styles.productImage}>
              {product && product.images && product.images.length > 0 ? (
  <img src={product.images[0].url} alt={product.title} />
) : (
  <img src="https://sm.mashable.com/t/mashable_in/article/i/ive-review/ive-reviewed-over-59-laptops-and-this-is-the-best-windows-la_rzds.1248.jpg" alt={product.title} />
)}
              </div>
              <div className={styles.productInfo}>
                <h3>{product.title || 'No Title'}</h3>
                <div className={styles.priceInfo}>
                  <span className={styles.salePrice}>${product.salePrice || 0}</span>
                  <span className={styles.listPrice}>${product.listPrice || 0}</span>
                  {product.salePrice && product.listPrice && product.listPrice > 0 ? (
                    <span className={styles.discount}>
                      {Math.round(((product.listPrice - product.salePrice) / product.listPrice) * 100)}% OFF
                    </span>
                  ) : null}
                </div>
                <p className={styles.store}>From: {product.store || 'Unknown'}</p>
                <div className={styles.actions}>
                  <Link
                    to={`/products/${product._id}`}
                    className={styles.viewDetailsButton}
                  >
                    View Details
                  </Link>
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