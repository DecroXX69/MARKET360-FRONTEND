import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Bubbles from './Bubbles';
import styles from './homepage.module.css';

const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const handleShopNow = () => {
    navigate('/products');
  };

  return (
    <div className={styles.container}>
      <Bubbles />
      <div className={styles.content}>
        <div className={`${styles.tagline} ${isVisible ? styles.visible : ''}`}>
          MARKET FOR ALL YOUR NEEDS
        </div>
        
        <div className={`${styles.titleContainer} ${isVisible ? styles.visible : ''}`}>
          <h1 className={styles.title}>
            <span className={styles.blue}>M</span>
            <span className={styles.purple}>A</span>
            <span className={styles.pink}>R</span>
            <span className={styles.blue}>K</span>
            <span className={styles.purple}>E</span>
            <span className={styles.blue}>T</span>
          </h1>
          <div className={styles.number}>
            <span className={styles.pink}>3</span>
            <span className={styles.purple}>6</span>
            <span className={styles.blue}>0</span>
          </div>
        </div>
        
        <button 
          className={`${styles.shopButton} ${isVisible ? styles.visible : ''}`}
          onClick={handleShopNow}
        >
          SHOP NOW <span className={styles.arrow}>→</span>
        </button>
      </div>
    </div>
  );
};

export default Homepage;