import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProductRating } from '../services/api';
import styles from './ProductPage.module.css';
import { Link } from 'react-router-dom';
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

        console.log('Sending like request for product:', productId);
        
        const response = await updateProductRating(productId, {
            action: 'like',
            userId: currentUser._id
        });

        console.log('Received response:', response);

        setProducts(products.map(product => {
            if (product._id === productId) {
                return {
                    ...product,
                    likes: response.userLiked ? 
                        (product.likes || []).concat(currentUser._id) : 
                        (product.likes || []).filter(id => id !== currentUser._id),
                    dislikes: response.userDisliked ? 
                        (product.dislikes || []).concat(currentUser._id) : 
                        (product.dislikes || []).filter(id => id !== currentUser._id)
                };
            }
            return product;
        }));
    } catch (error) {
        console.error('Error updating like:', error);
        alert('Failed to update like status. Please try again.');
    }
};


  const handleDislike = async (productId) => {
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
            likes: response.userLiked ? [...product.likes, currentUser._id] :
              product.likes.filter(id => id !== currentUser._id),
            dislikes: response.userDisliked ? [...product.dislikes, currentUser._id] :
              product.dislikes.filter(id => id !== currentUser._id)
          };
        }
        return product;
      }));
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