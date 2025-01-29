import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts, updateProductRating } from '../services/api';

const ProductDescription = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProducts(id);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading product:', error);
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleInteraction = async (action) => {
    if (!currentUser) {
      alert('Please log in to interact');
      return;
    }

    try {
      const updatedProduct = { ...product };
      if (action === 'like') {
        updatedProduct.likes = product.likes?.includes(currentUser._id)
          ? product.likes.filter(id => id !== currentUser._id)
          : [...(product.likes || []), currentUser._id];
        updatedProduct.dislikes = product.dislikes?.filter(id => id !== currentUser._id);
      } else if (action === 'dislike') {
        updatedProduct.dislikes = product.dislikes?.includes(currentUser._id)
          ? product.dislikes.filter(id => id !== currentUser._id)
          : [...(product.dislikes || []), currentUser._id];
        updatedProduct.likes = product.likes?.filter(id => id !== currentUser._id);
      }

      setProduct(updatedProduct);
      await updateProductRating(id, { action, userId: currentUser._id });
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Deals
        </button>
      </div>
    );
  }

  const hasUserLiked = product.likes?.includes(currentUser?._id);
  const hasUserDisliked = product.dislikes?.includes(currentUser?._id);
  const discountPercentage = Math.round(
    ((product.listPrice - product.salePrice) / product.listPrice) * 100
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← Back to Deals
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <div className="bg-white p-4 rounded-lg shadow">
            <img 
              src="/placeholder-product.jpg"
              alt={product.title}
              className="w-full h-64 object-cover rounded"
            />
          </div>

          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {product.description || "No description available"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-3xl font-bold text-green-600">
                ${product.salePrice}
              </span>
              <span className="text-lg text-gray-500 line-through">
                ${product.listPrice}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                {discountPercentage}% OFF
              </span>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Available at <span className="font-semibold">{product.store}</span>
              </p>
              <p className="text-gray-600">
                Category: <span className="font-semibold">{product.category}</span>
              </p>
            </div>

            <a
              href={product.dealUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Deal on {product.store}
            </a>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleInteraction('like')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  hasUserLiked 
                    ? 'bg-green-100 border-green-500 text-green-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                👍 {product.likes?.length || 0}
              </button>
              <button
                onClick={() => handleInteraction('dislike')}
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  hasUserDisliked 
                    ? 'bg-red-100 border-red-500 text-red-700' 
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                👎 {product.dislikes?.length || 0}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;