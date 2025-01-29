import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { BsBellFill } from 'react-icons/bs'; // Changed to filled version
import { IoAddCircle } from 'react-icons/io5'; // Changed to filled version
import {  FaUser } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { HiTrendingUp } from 'react-icons/hi';

const Navbar = ({ handlePostDeal, isAuthenticated, handleLogout }) => {
  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.topBanner}>
        Market360 is community-supported. We may get paid by brands for deals, including promoted items.
      </div>

      <nav className={styles.mainNav}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <img src="/your-logo.png" alt="Market360" />
          </Link>

          <div className={styles.searchSection}>
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search deals, coupons, stores and more..."
                className={styles.searchInput}
              />
              <button className={styles.searchButton}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>

            <div className={styles.mainNavLinks}>
              <div className={styles.navItem}>
                Categories <IoIosArrowDown />
              </div>
              <div className={styles.navItem}>
                Coupons <IoIosArrowDown />
              </div>
              <div className={styles.navItem}>
                Community Forums <IoIosArrowDown />
              </div>
              <div className={styles.navItem}>
                Personal Finance <IoIosArrowDown />
              </div>
            </div>
          </div>

          <div className={styles.actionButtons}>
            <Link to="/alerts" className={styles.actionButton}>
              <BsBellFill className={styles.icon} style={{color: '#ff1a75'}} />
              <span>Deal Alerts</span>
            </Link>
            {/* Fixed the onClick handler */}
            <button 
              onClick={handlePostDeal} 
              className={styles.actionButton}
              type="button"
            >
              <IoAddCircle className={styles.icon} style={{color: '#2196f3'}} />
              <span>Post a Deal</span>
            </button>
            {isAuthenticated ? (
              <button 
                onClick={handleLogout} 
                className={styles.actionButton}
                type="button"
              >
                <FaUser className={styles.icon} style={{color: '#ff7043'}} />
                <span>Logout</span>
              </button>
            ) : (
              <Link to="/auth" className={styles.actionButton}>
                <FaUser className={styles.icon} style={{color: '#ff7043'}} />
                <span>Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <nav className={styles.secondaryNav}>
        <div className={styles.container}>
          <div className={styles.secondaryNavLinks}>
            
            <Link to="/trending" className={styles.secondaryNavItem} style={{ color: 'black',fontWeight:'lighter'}}>
            Trending
           <HiTrendingUp className={styles.trendingIcon} />
           
           </Link>
            <Link to="/tool-deals" className={styles.secondaryNavItem}>Tool Deals</Link>
            <Link to="/tech-deals" className={styles.secondaryNavItem}>Tech Deals</Link>
            <Link to="/apparel" className={styles.secondaryNavItem}>Apparel</Link>
            <Link to="/credit-card-offers" className={styles.secondaryNavItem}>Credit Card Offers</Link>
            <Link to="/laptops" className={styles.secondaryNavItem}>Laptops & Computers</Link>
            <Link to="/video-games" className={styles.secondaryNavItem}>Video Games</Link>
            <Link to="/home-deals" className={styles.secondaryNavItem}>Home Deals</Link>
            <Link to="/credit-card-comparison" className={styles.secondaryNavItem}>Credit Card Comparison Tool</Link>
            <Link to="/sneaker-deals" className={styles.secondaryNavItem}>Sneaker Deals</Link>
            <Link to="/grocery-deals" className={styles.secondaryNavItem}>Grocery Deals</Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;