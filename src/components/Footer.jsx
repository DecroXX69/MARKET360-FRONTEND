import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Follow Us Section */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="footer-links">
              <Link to="/social/twitter">Twitter</Link>
              <Link to="/social/facebook">Facebook</Link>
              <Link to="/social/instagram">Instagram</Link>
              <Link to="/social/youtube">YouTube</Link>
            </div>
          </div>

          {/* About Section */}
          <div className="footer-section">
            <h3>About</h3>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/help">Help Center</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          {/* More Section */}
          <div className="footer-section">
            <h3>More</h3>
            <div className="footer-links">
              <Link to="/deals">Deal Alerts</Link>
              <Link to="/live">Live Deals</Link>
              <Link to="/rewards">Rewards Program</Link>
            </div>
          </div>

          {/* Legal Section */}
          <div className="footer-section">
            <h3>Legal</h3>
            <div className="footer-links">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms and Policies</Link>
              <Link to="/accessibility">Accessibility</Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              © {currentYear} Market360. All Rights Reserved.
            </div>
            <div className="footer-bottom-links">
              <Link to="/redesign">Redesign</Link>
              <span className="separator">•</span>
              <Link to="/mobile">Mobile</Link>
              <span className="separator">•</span>
              <Link to="/classic">Classic</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
