import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <h3>🌊 Nile Market</h3>
          <p>Ethiopia's premier online marketplace. Buy and sell with confidence.</p>
        </div>
        <div className="footer-links">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/post-product">Sell a Product</Link>
          <Link to="/login">Login</Link>
        </div>
        <div className="footer-links">
          <h4>Categories</h4>
          <Link to="/shop?category=Electronics">Electronics</Link>
          <Link to="/shop?category=Clothing">Clothing</Link>
          <Link to="/shop?category=Food & Groceries">Food</Link>
          <Link to="/shop?category=Home & Garden">Home</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 Nile Market. Made with ❤️ in Ethiopia</p>
      </div>
    </footer>
  );
}
