import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="container empty-cart">
          <FiShoppingBag size={64} color="var(--border)" />
          <h2>Your cart is empty</h2>
          <p>Discover amazing products on Nile Market</p>
          <Link to="/shop" className="btn-primary">Browse Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart <span>({cart.length} items)</span></h1>
          <button className="clear-btn" onClick={clearCart}>Clear All</button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map(item => {
              const image = item.images?.[0] ? `${API_URL}${item.images[0]}` : 'https://via.placeholder.com/80?text=N/A';
              return (
                <div key={item._id} className="cart-item">
                  <img src={image} alt={item.name} />
                  <div className="item-info">
                    <Link to={`/product/${item._id}`}><h3>{item.name}</h3></Link>
                    <span className="item-cat">{item.category}</span>
                  </div>
                  <div className="qty-ctrl">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                  </div>
                  <span className="item-price">ETB {(item.price * item.quantity).toLocaleString()}</span>
                  <button className="remove-btn" onClick={() => removeFromCart(item._id)}><FiTrash2 /></button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-rows">
              {cart.map(item => (
                <div key={item._id} className="summary-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>ETB {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>ETB {totalPrice.toLocaleString()}</span>
            </div>
            <Link to="/checkout" className="btn-primary checkout-btn">
              Proceed to Checkout <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
