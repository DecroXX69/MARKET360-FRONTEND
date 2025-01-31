import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById,  toggleLike, toggleDislike  } from '../services/api';
import styles from './ProductDescription.module.css';

const ProductDescription = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleLike = async () => {
    try {
      if (!currentUser) {
        alert('Please login to like products');
        return;
      }
  
      console.log('Sending like request for product:', id);
  
      const response = await toggleLike(id, {
        action: 'like',
        userId: currentUser._id
      });
  
      console.log('Received response:', response);
  
      setProduct({
        ...product,
        likeCount: response.likeCount,
        dislikeCount: response.dislikeCount,
        likes: response.likes,
        dislikes: response.dislikes
      });
    } catch (error) {
      console.error('Error updating like:', error);
      alert('Failed to update like status. Please try again.');
    }
  };
  
  const handleDislike = async () => {
    try {
      if (!currentUser) {
        alert('Please login to dislike products');
        return;
      }
  
      console.log('Sending dislike request for product:', id);
  
      const response = await toggleDislike(id, {
        action: 'dislike',
        userId: currentUser._id
      });
  
      console.log('Received response:', response);
  
      setProduct({
        ...product,
        likeCount: response.likeCount,
        dislikeCount: response.dislikeCount,
        likes: response.likes,
        dislikes: response.dislikes
      });
    } catch (error) {
      console.error('Error updating dislike:', error);
      alert('Failed to update dislike status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorScreen}>
        <h2 className={styles.errorTitle}>Product Not Found</h2>
        <p className={styles.errorText}>The deal you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className={styles.btnPrimary}
        >
          Return to Deals
        </button>
      </div>
    );
  }

  const discount = Math.round(
    ((product.listPrice - product.salePrice) / product.listPrice) * 100
  );

  return (
    <div className={styles.productContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{product.title}</h1>
        <button 
          onClick={() => navigate('/')}
          className={styles.btnBack}
        >
          ← Back to Deals
        </button>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.imageSection}>
          <div className={styles.productImageContainer}>
            <img 
              src="/placeholder-product.jpg"
              alt={product.title}
              className={styles.productImage}
            />
          </div>
          <div className={styles.gallery}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className={styles.galleryItem}></div>
            ))}
          </div>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.priceInfo}>
            <div className={styles.priceBlock}>
              <span className={styles.salePrice}>${product.salePrice}</span>
              <span className={styles.originalPrice}>${product.listPrice}</span>
              <span className={styles.discount}>{discount}% OFF</span>
            </div>

            <div className={styles.storeInfo}>
              <p>Available at <strong>{product.store}</strong></p>
              <p>Category: <strong>{product.category}</strong></p>
            </div>

            <a
              href={product.dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnBuy}
            >
              Get Deal at {product.store}
            </a>

            <div className={styles.ratingButtons}>
  <button
    onClick={handleLike}
    className={`${styles.btnLike} ${product.likes?.includes(currentUser?._id) ? styles.active : ''}`}
  >
    👍 {product.likeCount || 0}
  </button>
  <button
    onClick={handleDislike}
    className={`${styles.btnDislike} ${product.dislikes?.includes(currentUser?._id) ? styles.active : ''}`}
  >
    👎 {product.dislikeCount || 0}
  </button>
</div>
          </div>

          <div className={styles.descriptionSection}>
            <h2 className={styles.descriptionTitle}>Product Details</h2>
            <p className={styles.descriptionText}>
              {product.description || "No description available"}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDescription;
