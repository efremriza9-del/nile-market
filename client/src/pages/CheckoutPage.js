import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', address: '', city: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const items = cart.map(i => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity }));
      await API.post('/api/orders', { items, shippingAddress: form, totalPrice });
      clearCart();
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page">
        <div className="container success-screen">
          <FiCheckCircle size={72} color="var(--primary)" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We will contact you soon.</p>
          <button className="btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="checkout-title">Checkout</h1>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleOrder}>
            <div className="form-section">
              <h3>Shipping Address</h3>
              <div className="form-grid">
                <div className="form-group full"><label>Full Name *</label><input name="fullName" value={form.fullName} onChange={handleChange} required /></div>
                <div className="form-group full"><label>Address *</label><input name="address" value={form.address} onChange={handleChange} required /></div>
                <div className="form-group"><label>City *</label><input name="city" value={form.city} onChange={handleChange} required /></div>
                <div className="form-group"><label>Phone *</label><input name="phone" value={form.phone} onChange={handleChange} required /></div>
              </div>
            </div>
            <button type="submit" className="btn-primary place-order-btn" disabled={loading}>
              {loading ? 'Placing Order...' : '✅ Place Order'}
            </button>
          </form>

          <div className="order-summary-box">
            <h3>Order Summary</h3>
            {cart.map(item => (
              <div key={item._id} className="order-item">
                <span>{item.name} × {item.quantity}</span>
                <span>ETB {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="order-total">
              <strong>Total</strong>
              <strong>ETB {totalPrice.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
