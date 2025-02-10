import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import styles from './ProductDescription.module.css';

const ProductDescription = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        // Ensure images array exists
        const productWithImages = {
          ...data,
          images: data.images || []
        };
        console.log('Fetched product data:', productWithImages);
        setProduct(productWithImages);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(true);
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const discount = product && product.listPrice > 0
    ? Math.round(((product.listPrice - product.salePrice) / product.listPrice) * 100)
    : 0;

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (error) {
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

  if (!product) {
    return <div className={styles.errorScreen}>Loading...</div>;
  }

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
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[selectedImageIndex].url}
                alt={product.title}
                className={styles.productImage}
              />
            ) : (
              <div className={styles.noImage}>
                No Image Available
              </div>
            )}
            
            {product.images && product.images.length > 1 && (
              <div className={styles.gallery}>
                {product.images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`${styles.galleryItem} ${index === selectedImageIndex ? styles.active : ''}`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img 
                      src={image.url} 
                      alt={`${product.title} - view ${index + 1}`} 
                      className={styles.galleryThumb}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.priceInfo}>
            <div className={styles.priceBlock}>
              <span className={styles.salePrice}>${product.salePrice?.toFixed(2) || '0.00'}</span>
              {product.listPrice > 0 && (
                <span className={styles.originalPrice}>${product.listPrice?.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className={styles.discount}>
                  {discount}% OFF
                </span>
              )}
            </div>

            <div className={styles.storeInfo}>
              <p>Available at <strong>{product.store || 'N/A'}</strong></p>
              <p>Category: <strong>{product.category || 'N/A'}</strong></p>
            </div>

            {product.dealUrl && (
              <a
                href={product.dealUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnBuy}
              >
                Get Deal at {product.store}
              </a>
            )}
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