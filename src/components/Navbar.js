import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ShoppingBagRounded from '@mui/icons-material/ShoppingBagRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import AdminPanelSettingsRounded from '@mui/icons-material/AdminPanelSettingsRounded';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';
import { useCart } from './ContextReducer';

const navClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

export default function Navbar() {
  const cartItems = useCart();
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('authToken'));
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const cartCount = cartItems.reduce((count, item) => count + item.qty, 0);

  return (
    <nav className="navbar navbar-expand-lg app-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="GoFood home">
          <span className="brand-mark"><RestaurantRounded /></span>
          <span className="brand-title">Go<span>Food</span></span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav mx-auto app-nav-links">
            <NavLink className={navClass} to="/" end><HomeRounded /> Home</NavLink>
            {isAuthenticated && <NavLink className={navClass} to="/orders"><ReceiptLongRounded /> Orders</NavLink>}
            {isAdmin && <NavLink className={navClass} to="/admin"><AdminPanelSettingsRounded /> Dashboard</NavLink>}
          </div>

          <div className="navbar-actions">
            {!isAuthenticated ? (
              <>
                <Link className="btn nav-login" to="/login">Log in</Link>
                <Link className="btn btn-brand" to="/createuser">Create account</Link>
              </>
            ) : (
              <>
                <NavLink className={({ isActive }) => `cart-nav-btn${isActive ? ' active' : ''}`} to="/cart">
                  <ShoppingBagRounded /><span>Cart</span>
                  {cartCount > 0 && <b>{cartCount}</b>}
                </NavLink>
                <button className="logout-btn" onClick={handleLogout} title="Log out" aria-label="Log out"><LogoutRounded /></button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
