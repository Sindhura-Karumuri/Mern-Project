import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">🍴 Canteen</h3>
            <p className="text-gray-300">
              Your favorite campus dining experience with fresh meals and convenient meal plans.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
              <Link to="/faq" className="footer-link">FAQ</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              <span className="footer-link">Fresh Meals</span>
              <span className="footer-link">Meal Plans</span>
              <span className="footer-link">Online Ordering</span>
              <span className="footer-link">Quick Delivery</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@canteen.com</p>
              <p>📞 +1 (555) 123-4567</p>
              <p>📍 Campus Building A</p>
              <p>🕒 Mon-Fri: 7AM-8PM</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 Canteen Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}