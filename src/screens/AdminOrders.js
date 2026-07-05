import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardRounded from '@mui/icons-material/DashboardRounded';
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import { buildApiUrl, parseApiResponse } from '../utils/api';

const ORDER_STATUSES = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '-';

const normalizeOrderStatus = (status) => (status === 'Placed' || !status ? 'Pending' : status);

const statusClassName = (status) =>
  `order-status order-status--${normalizeOrderStatus(status).toLowerCase().replace(/\s/g, '-')}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/api/admin/orders'), {
          headers: { 'auth-token': token }
        });
        const json = await parseApiResponse(res, 'Failed to load orders');
        if (!json?.success) throw new Error(json?.message || 'Failed to fetch orders');
        setOrders(json.orders || []);
      } catch (error) {
        console.error(error);
        toast.error(error.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleStatusChange = async (orderId, status) => {
    const previousOrders = orders;
    setUpdatingOrderId(orderId);
    setOrders((current) => current.map((order) => (
      order._id === orderId ? { ...order, status } : order
    )));

    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(buildApiUrl(`/api/admin/order/${orderId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify({ status })
      });
      const json = await parseApiResponse(res, 'Failed to update order status');
      if (!json?.success) throw new Error(json?.message || 'Failed to update status');

      setOrders((current) => current.map((order) => (
        order._id === orderId ? json.order : order
      )));
      toast.success('Order status updated');
    } catch (error) {
      console.error(error);
      setOrders(previousOrders);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title"><span>GF</span><div><strong>GoFood</strong><small>Admin workspace</small></div></div>
        <nav aria-label="Admin navigation">
          <Link to="/admin"><DashboardRounded /> Overview</Link>
          <Link to="/admin/foods"><RestaurantMenuRounded /> Food items</Link>
          <Link to="/admin/categories"><CategoryRounded /> Categories</Link>
          <Link className="active" to="/admin/orders"><ReceiptLongRounded /> Orders</Link>
        </nav>
      </aside>

      <main className="admin-dashboard">
        <div className="admin-dashboard__header">
          <div>
            <div className="admin-eyebrow"><ReceiptLongRounded fontSize="small" /> Orders</div>
            <h1>Manage Orders</h1>
            <p>Update customer order progress manually.</p>
          </div>
        </div>

        <section className="dashboard-panel">
          <div className="table-responsive recent-orders-table">
            <table className="table align-middle mb-0">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td><span className="order-id">#{order._id.slice(-7).toUpperCase()}</span></td>
                    <td><strong>{order.userId?.name || 'Customer'}</strong><small>{order.userId?.email || ''}</small></td>
                    <td>{order.orderedItems?.length || 0}</td>
                    <td>{currency.format(order.totalPrice || 0)}</td>
                    <td>
                      <div className="order-status-control">
                        <span className={statusClassName(order.status || order.orderStatus)}>{normalizeOrderStatus(order.status || order.orderStatus)}</span>
                        <select
                          className="form-select form-select-sm order-status-select"
                          value={normalizeOrderStatus(order.status || order.orderStatus)}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) => handleStatusChange(order._id, event.target.value)}
                          aria-label={`Update status for order ${order._id.slice(-7).toUpperCase()}`}
                        >
                          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {!orders.length && (
                  <tr>
                    <td colSpan="6" className="panel-empty">{loading ? 'Loading orders...' : 'No orders yet.'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
