// src/components/Policies/RefundPolicy.jsx
import React from 'react';
import styles from './Policies.module.css';

const RefundPolicy = () => (
  <div className={`container ${styles.policyContainer}`}>  
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">Refund Policy & Returns</h2>
        <h5 className="mb-2">Refund Policy</h5>
        <ol className="ps-3 mb-4">
          <li className="mb-2"><strong>Eligibility for Refunds:</strong> Refunds are only available for products that are returned in their original condition within 15 days of purchase.</li>
          <li className="mb-2"><strong>Refund Process:</strong> To request a refund, please contact our customer support team with your order details.</li>
          <li className="mb-2"><strong>Refund Timeframe:</strong> Once your return is received and inspected, we will send you an email to notify you that we have received your returned item and the approval or rejection of your refund. Once approved, refunds will take 15 to be credited into the beneficiary’s bank account.</li>
          <li className="mb-2"><strong>Exchanges:</strong> We only replace items if they are defective or damaged. In case of exchanges, we will initiate the process within 7 days and the replacement will be delivered within 7 days.</li>
        </ol>
        <h5 className="mb-2">Return Policy</h5>
        <ol className="ps-3 mb-4">
          <li className="mb-2"><strong>Eligibility for Returns:</strong> To be eligible for a return, your item must be unused and in the same condition that you received it.</li>
          <li className="mb-2"><strong>Return Process:</strong> To initiate a return, please contact our customer support team within 7 days of receiving your item.</li>
          <li className="mb-2"><strong>Return Shipping:</strong> You will be responsible for paying for your own shipping costs for returning your item.</li>
          <li className="mb-2"><strong>Return Timeframe:</strong> In case of an approved return, your replacement will be delivered within 7.</li>
        </ol>
        <h5 className="mb-2">Shipping Policy</h5>
        <ol className="ps-3 mb-4">
          <li className="mb-2"><strong>Shipping Rates:</strong> Shipping rates are calculated based on the weight of your order and your location.</li>
          <li className="mb-2"><strong>Shipping Times:</strong> Orders are typically processed, shipped and delivered within 3 business days.</li>
          <li className="mb-2"><strong>International Shipping:</strong> We offer international shipping to select countries. Please note that customs duties and taxes may apply. Orders will be delivered within 7 business days.</li>
          <li className="mb-2"><strong>Order Tracking:</strong> Once your order has shipped, you will receive a tracking number via email.</li>
        </ol>
        <h5 className="mb-2">Privacy Policy</h5>
        <ol className="ps-3">
          <li className="mb-2"><strong>Information We Collect:</strong> We collect personal information such as your name, email address, and payment details when you place an order or sign up for our newsletter.</li>
          <li className="mb-2"><strong>How We Use Your Information:</strong> We use your information to process your orders, communicate with you, and improve our services.</li>
          <li className="mb-2"><strong>Cookies:</strong> We use cookies to personalize content, analyze our traffic, and improve your browsing experience.</li>
          <li className="mb-2"><strong>Data Security:</strong> We take precautions to protect your information both online and offline.</li>
          <li className="mb-2"><strong>Changes to This Privacy Policy:</strong> We reserve the right to update or change our Privacy Policy at any time.</li>
        </ol>
      </div>
    </div>
  </div>
);

export default RefundPolicy;
