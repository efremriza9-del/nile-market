import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiSmartphone } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import API from '../utils/api';
import './HomePage.css';

const categories = [
  { name: 'Electronics', icon: '💻' },
  { name: 'Clothing', icon: '👔' },
  { name: 'Food & Groceries', icon: '🛒' },
  { name: 'Home & Garden', icon: '🏠' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Books', icon: '📚' },
  { name: 'Other', icon: '📦' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/api/products?limit=8').then(r => setFeatured(r.data.products)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-tag">🇪🇹 Ethiopia's Marketplace</span>
            <h1>Buy & Sell<br /><span>Anything</span> Online</h1>
            <p>Discover thousands of products from sellers across Ethiopia. Shop with confidence, sell with ease.</p>
            <div className="hero-btns">
              <Link to="/shop" className="btn-primary">Browse Shop <FiArrowRight /></Link>
              <Link to="/post-product" className="btn-outline">Start Selling</Link>
            </div>
          </div>
          <div className="hero-img">
            <div className="hero-blob">🛍️</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/shop" className="see-all">See all <FiArrowRight /></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${cat.name}`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/shop" className="see-all">See all <FiArrowRight /></Link>
          </div>
          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <p>No products yet. <Link to="/post-product">Be the first to sell!</Link></p>
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container features-grid">
          <div className="feature">
            <FiTruck size={32} color="var(--primary)" />
            <h3>Fast Delivery</h3>
            <p>Quick delivery across Ethiopia</p>
          </div>
          <div className="feature">
            <FiShield size={32} color="var(--primary)" />
            <h3>Secure Payments</h3>
            <p>Your transactions are always safe</p>
          </div>
          <div className="feature">
            <FiSmartphone size={32} color="var(--primary)" />
            <h3>24/7 Support</h3>
            <p>We are here whenever you need us</p>
          </div>
        </div>
      </section>
    </div>
  );
}
