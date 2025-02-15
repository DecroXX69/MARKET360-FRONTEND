import { useEffect, useState } from 'react';
import { approveProduct, rejectProduct, getProductsApproved, getProducts, deleteProduct, incrementProductView } from '../services/api';
import toast from 'react-hot-toast';
import styles from './AdminPage.module.css';

const AdminPage = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [analyticsProducts, setAnalyticsProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchPendingProducts();
    fetchApprovedProducts();
    fetchAnalyticsProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const products = await getProducts({ status: 'pending' });
      setPendingProducts(products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending products');
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedProducts = async () => {
    try {
      const products = await getProductsApproved({ status: 'approved' });
      setApprovedProducts(products);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load approved products');
    }
  };

  const fetchAnalyticsProducts = async () => {
    try {
      const products = await getProducts({ sortBy: 'viewCount', order: 'desc', limit: 10 });
      setAnalyticsProducts(products);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load analytics data');
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveProduct(id);
      await fetchPendingProducts();
      await fetchApprovedProducts();
      toast.success('Product approved');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectProduct(id);
      await fetchPendingProducts();
      toast.success('Product rejected');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject product');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      await fetchPendingProducts();
      await fetchApprovedProducts();
      toast.success('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const renderProductTable = (products, isPending) => (
    <table className={styles.productsTable}>
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Title</th>
          <th>View Count</th>
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
        {products.map(product => (
          <tr key={product._id}>
            <td className={styles.imageCell}>
              <img 
                src={product.images?.[0]?.url || 'https://example.com/placeholder.png'}
                alt={product.title || 'No Image'}
                className={styles.productImage}
                onClick={() => incrementProductView(product._id)}
              />
            </td>
            <td>{product.title}</td>
            <td>{product.viewCount}</td>
            <td>{product.description.substring(0, 100)}...</td>
            <td>${product.salePrice}</td>
            <td>${product.listPrice}</td>
            <td>{product.store}</td>
            <td>{new Date(product.createdAt).toLocaleString()}</td>
            <td>{product.createdBy?.username || 'User Unknown'}</td>
            <td className={styles.dealLinkCell}>
              {product.dealUrl ? (
                <a href={product.dealUrl} target="_blank" rel="noopener noreferrer" className={styles.dealLink}>
                  {product.dealUrl.substring(0, 100)}
                </a>
              ) : (
                'No Deal URL'
              )}
            </td>
            <td>
              {isPending ? (
                <>
                  <button onClick={() => handleApprove(product._id)} className={styles.approveButton}>Approve</button>
                  <button onClick={() => handleReject(product._id)} className={styles.rejectButton}>Reject</button>
                </>
              ) : (
                <button onClick={() => handleDelete(product._id)} className={styles.deleteButton}>Delete</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.tabNav}>
        {['pending', 'approved', 'analytics'].map(tab => (
          <button 
            key={tab} 
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Products
          </button>
        ))}
      </div>
      {activeTab === 'pending' ? renderProductTable(pendingProducts, true) : null}
      {activeTab === 'approved' ? renderProductTable(approvedProducts, false) : null}
      {activeTab === 'analytics' && (
        <div>
          <h2>Top Viewed Products</h2>
          <table className={styles.analyticsTable}>
            <thead>
              <tr>
                <th>Title</th>
                <th>View Count</th>
              </tr>
            </thead>
            <tbody>
              {analyticsProducts.map(product => (
                <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.viewCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPage;