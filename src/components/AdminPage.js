import { useEffect, useState } from 'react';
import { approveProduct, rejectProduct, getProductsApproved } from '../services/api';
import toast from 'react-hot-toast';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const products = await getProductsApproved({ status: 'pending' });
        setPendingProducts(products);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load pending products');
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveProduct(id);
      setPendingProducts(prev => prev.filter(p => p._id !== id));
      toast.success('Product approved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProduct(id);
      setPendingProducts(prev => prev.filter(p => p._id !== id));
      toast.error('Product rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject product');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          {pendingProducts.length === 0 ? (
            <div className={styles.empty}>
              <img 
                src="https://example.com/empty-admin.png" 
                alt="Empty Dashboard" 
                className={styles.emptyImage}
              />
              <p className={styles.emptyText}>No pending products for review</p>
            </div>
          ) : (
            <table className={styles.productsTable}>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Sale Price</th>
                  <th>List Price</th>
                  <th>Store</th>
                  <th>Created At</th>
                  <th>Creator</th>
                  <th>Deal URL</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProducts.map(product => (
                  <tr key={product._id}>
                    <td className={styles.imageCell}>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.title} 
                          className={styles.productImage}
                        />
                      ) : (
                        <img 
                          src="https://example.com/placeholder.png" 
                          alt="No Image" 
                          className={styles.productImage}
                        />
                      )}
                    </td>
                    <td>{product.title}</td>
                    <td>{product.description.substring(0, 100)}...</td>
                    <td>${product.salePrice}</td>
                    <td>${product.listPrice}</td>
                    <td>{product.store}</td>
                    <td>
                      {new Date(product.createdAt).toLocaleString()}
                    </td>
                    <td>{product.createdBy?.username || 'User Unknown'}</td>
                    <td>
                      {product.dealUrl ? (
                        <a 
                          href={product.dealUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.dealLink}
                        >
                          {product.dealUrl}
                        </a>
                      ) : (
                        'No Deal URL'
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleApprove(product._id)} 
                        className={styles.approveButton}
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(product._id)} 
                        className={styles.rejectButton}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPage;