import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import ShoppingBagRounded from '@mui/icons-material/ShoppingBagRounded';
import { toast } from 'react-toastify';
import { buildApiUrl, parseApiResponse } from '../utils/api';

const normalizeOrderStatus = (status) => (status === 'Placed' || !status ? 'Pending' : status);
const statusClassName = (status) =>
  `customer-order-status customer-order-status--${normalizeOrderStatus(status).toLowerCase().replace(/\s/g, '-')}`;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(buildApiUrl('/api/myOrders'), {
          headers: { 'auth-token': token }
        });
        const json = await parseApiResponse(res, 'Failed to fetch orders');
        if (!json?.success) throw new Error(json?.message || 'Failed to fetch');
        setOrders(json.orders || []);
      } catch (err) {
        const message = err.message || 'Failed to load orders';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return (
    <div className="container page-section orders-page">
      <div className="page-heading"><span className="section-kicker">Your purchases</span><h1>Order history</h1></div>
      <div className="orders-loading">{Array.from({ length: 3 }, (_, index) => <div className="order-skeleton skeleton-shine" key={index} />)}</div>
    </div>
  );
  if (error) return <div className="container page-section"><div className="error-state"><strong>We couldn’t load your orders.</strong><span>{error}</span><button className="btn btn-brand" onClick={() => window.location.reload()}>Retry</button></div></div>;
  if (!orders.length) return (
    <div className="container page-section"><div className="empty-state modern-empty full-page-empty">
      <span className="empty-state-icon"><ShoppingBagRounded /></span><h2>Your order history is empty</h2>
      <p>Your favourite dishes will appear here once you place an order.</p>
      <Link className="btn btn-brand" to="/">Explore the menu</Link>
    </div></div>
  );

  return (
    <div className="container page-section orders-page">
      <div className="page-heading"><span className="section-kicker">Your purchases</span><h1>Order history</h1><p>Review every meal and follow its delivery status.</p></div>
      <div className="orders-list">
        {orders.map((order) => (
          <article key={order._id} className="order-card">
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex gap-3"><span className="order-card-icon"><ReceiptLongRounded /></span><div>
                <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
                <div className="small text-muted">{new Date(order.createdAt).toLocaleString()}</div>
                <span className={statusClassName(order.status || order.orderStatus)}>{normalizeOrderStatus(order.status || order.orderStatus)}</span>
              </div></div>
              <div className="text-end">
                <div className="order-card-total">₹{order.totalPrice}</div>
                <Link to={`/order/${order._id}`} className="btn btn-sm btn-outline-brand mt-2">View details</Link>
              </div>
            </div>
            <div className="order-card-footer">{order.orderedItems.length} item{order.orderedItems.length !== 1 ? 's' : ''}<span>•</span> Delivered to your saved location</div>
          </article>
        ))}
      </div>
    </div>
  );
}
