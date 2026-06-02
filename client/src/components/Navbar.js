import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPlus, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">🌊 Nile Market</Link>

        <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link>
          {user && <Link to="/post-product" onClick={() => setMenuOpen(false)}><FiPlus /> Sell</Link>}
          {user?.role === 'admin' && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}

          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <span className="user-name"><FiUser /> {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}><FiLogOut /></button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
