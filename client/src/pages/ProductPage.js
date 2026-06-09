import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiArrowLeft, FiUser, FiMessageCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const { addToCart } = useCart();
  const { user } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    API.get(`/api/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    toast.success(`Added ${qty} × ${product.name} to cart!`);
  };

  const handleChat = async () => {
    if (!user) { navigate('/login'); return; }
    if (user._id === product.seller?._id) {
      toast.error('This is your own product!');
      return;
    }
    try {
      const conversationId = [user._id, product.seller._id, product._id].sort().join('_');
      await API.post('/api/messages', {
        receiverId: product.seller._id,
        productId: product._id,
        text: `Hi! I am interested in your product: ${product.name}`,
      });
      navigate(`/chat/${conversationId}`);
    } catch (err) {
      toast.error('Could not start chat');
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/api/products/${id}/reviews`, review);
      toast.success('Review submitted!');
      const r = await API.get(`/api/products/${id}`);
      setProduct(r.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="loading"><div className="spinner" /></div>;
  if (!product) return <div className="page container"><p>Product not found.</p></div>;

  const images = product.images?.length
    ? product.images.map(i => i.startsWith('http') ? i : `${API_URL}${i}`)
    : ['https://via.placeholder.com/500x400?text=No+Image'];

  return (
    <div className="page">
      <div className="container">
        <Link to="/shop" className="back-link"><FiArrowLeft /> Back to Shop</Link>

        <div className="product-detail">
          <div className="product-images">
            <div className="main-img">
              <img src={images[activeImg]} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className="img-thumbnails">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="" className={activeImg === i ? 'active' : ''} onClick={() => setActiveImg(i)} />
                ))}
              </div>
            )}
          </div>

          <div className="product-details">
            <span className="product-category">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="rating-row">
              {[1,2,3,4,5].map(s => <FiStar key={s} fill={s <= product.rating ? '#f5a623' : 'none'} color="#f5a623" />)}
              <span>{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>
            <div className="price-big">ETB {product.price?.toLocaleString()}</div>
            <p className="desc">{product.description}</p>
            <p className="stock">Stock: <strong>{product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</strong></p>
            <p className="seller-info"><FiUser /> Sold by: {product.seller?.name}</p>

            {product.stock > 0 && (
              <div className="add-to-cart-row">
                <div className="qty-ctrl">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                </div>
                <button className="btn-primary" onClick={handleAddToCart}>
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            )}

            {user && user._id !== product.seller?._id && (
              <button className="btn-chat" onClick={handleChat}>
                <FiMessageCircle /> Chat with Seller
              </button>
            )}
          </div>
        </div>

        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          {product.reviews?.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
          <div className="reviews-list">
            {product.reviews?.map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <strong>{r.name}</strong>
                  <div className="stars">
                    {[1,2,3,4,5].map(s => <FiStar key={s} fill={s <= r.rating ? '#f5a623' : 'none'} color="#f5a623" size={13} />)}
                  </div>
                </div>
                <p>{r.comment}</p>
              </div>
            ))}
          </div>

          {user && (
            <form className="review-form" onSubmit={handleReview}>
              <h3>Write a Review</h3>
              <div className="rating-select">
                {[1,2,3,4,5].map(s => (
                  <button type="button" key={s} onClick={() => setReview(r => ({ ...r, rating: s }))}>
                    <FiStar fill={s <= review.rating ? '#f5a623' : 'none'} color="#f5a623" size={22} />
                  </button>
                ))}
              </div>
              <textarea
                value={review.comment}
                onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                placeholder="Share your experience..."
                required rows={4}
              />
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
