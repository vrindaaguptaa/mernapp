import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-inner">
        <Link to="/" className="footer-brand"><span><RestaurantRounded /></span>GoFood</Link>
        <p>Delicious meals, thoughtfully delivered.</p>
        <nav><Link to="/">Menu</Link><Link to="/orders">Orders</Link><Link to="/cart">Cart</Link></nav>
        <small>© 2026 GoFood. Made for food lovers.</small>
      </div>
    </footer>
  );
}
