import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const image = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div className="product-img-wrap">
        <img src={image} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="out-of-stock">Out of Stock</span>}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <div className="product-rating">
            <FiStar fill="#f5a623" color="#f5a623" size={13} />
            <span>{product.rating?.toFixed(1) || '0.0'}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>
          <span className="product-price">ETB {product.price?.toLocaleString()}</span>
        </div>
        <button className="add-cart-btn" onClick={handleAdd} disabled={product.stock === 0}>
          <FiShoppingCart size={15} /> Add to Cart
        </button>
      </div>
    </Link>
  );
}
