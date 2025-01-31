import React, { useState } from 'react';
import styles from './ProductFilter.module.css';

const ProductFilter = ({ categories, onFilterUpdate }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const [selectedCategories, setSelectedCategories] = useState([]);

  const handlePriceChange = (e) => {
    const value = parseFloat(e.target.value);
    setPriceRange(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  const handleApply = () => {
    onFilterUpdate(priceRange, selectedCategories);
  };

  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Price Range</h3>
        <div className={styles.priceInputs}>
          <input
            type="number"
            name="min"
            value={priceRange.min}
            onChange={handlePriceChange}
            placeholder="Min"
            className={styles.input}
          />
          <input
            type="number"
            name="max"
            value={priceRange.max}
            onChange={handlePriceChange}
            placeholder="Max"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Categories</h3>
        <div className={styles.categoryList}>
          {categories.map(category => (
            <label key={category} className={styles.categoryLabel}>
              <input
                type="checkbox"
                value={category}
                checked={selectedCategories.includes(category)}
                onChange={handleCategoryChange}
                className={styles.checkbox}
              />
              {category}
            </label>
          ))}
        </div>
      </div>

      <button 
        className={styles.applyButton}
        onClick={handleApply}
      >
        Apply Filters
      </button>
    </div>
  );
};

export default ProductFilter;