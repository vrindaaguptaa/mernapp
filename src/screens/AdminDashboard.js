import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import RestaurantMenuRounded from '@mui/icons-material/RestaurantMenuRounded';
import CategoryRounded from '@mui/icons-material/CategoryRounded';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import PeopleAltRounded from '@mui/icons-material/PeopleAltRounded';
import PaymentsRounded from '@mui/icons-material/PaymentsRounded';
import PersonAddAltRounded from '@mui/icons-material/PersonAddAltRounded';
import ShoppingBagRounded from '@mui/icons-material/ShoppingBagRounded';
import AddCircleRounded from '@mui/icons-material/AddCircleRounded';
import DashboardRounded from '@mui/icons-material/DashboardRounded';

import { buildApiUrl, parseApiResponse } from '../utils/api';
const ORDER_STATUSES = ['Pending', 'Preparing', 'Delivered', 'Cancelled'];
const initialDashboard = {
  totalFoods: 0,
  totalCategories: 0,
  totalOrders: 0,
  totalUsers: 0,
  newUsersThisWeek: 0,
  totalRevenue: 0,
  recentOrders: [],
  recentUsers: [],
  activities: [],
  analytics: {
    lastSevenDays: [],
    mostOrderedItems: [],
    orderStatusCounts: { Pending: 0, Preparing: 0, Delivered: 0 }
  }
};

const currency = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
    : '—';

const relativeTime = (value) => {
  if (!value) return '';
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (seconds < 172800) return 'Yesterday';
  const days = Math.floor(seconds / 86400);
  return days < 7 ? `${days} days ago` : formatDate(value);
};

const activityIcons = {
  user: <PersonAddAltRounded />,
  order: <ShoppingBagRounded />,
  food: <RestaurantMenuRounded />,
  category: <AddCircleRounded />
};

const normalizeOrderStatus = (status) => (status === 'Placed' || !status ? 'Pending' : status);

const statusClassName = (status) =>
  `order-status order-status--${normalizeOrderStatus(status).toLowerCase().replace(/\s/g, '-')}`;

const adjustStatusCounts = (counts, previousStatus, nextStatus) => {
  const nextCounts = {
    ...initialDashboard.analytics.orderStatusCounts,
    ...(counts || {})
  };

  if (Object.prototype.hasOwnProperty.call(nextCounts, previousStatus)) {
    nextCounts[previousStatus] = Math.max(0, nextCounts[previousStatus] - 1);
  }
  if (Object.prototype.hasOwnProperty.call(nextCounts, nextStatus)) {
    nextCounts[nextStatus] += 1;
  }

  return nextCounts;
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(buildApiUrl('/api/admin/stats'), {
          headers: { 'auth-token': token }
        });
        const json = await parseApiResponse(res, 'Failed to load dashboard');
        if (!json?.success) throw new Error(json?.message || 'Failed to fetch dashboard');
        setDashboard({ ...initialDashboard, ...json });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleOrderStatusChange = async (orderId, status) => {
    const previousDashboard = dashboard;
    const orderToUpdate = dashboard.recentOrders.find((order) => order._id === orderId);
    const previousStatus = normalizeOrderStatus(orderToUpdate?.status || orderToUpdate?.orderStatus);

    if (previousStatus === status) return;

    setUpdatingOrderId(orderId);
    setDashboard((current) => ({
      ...current,
      recentOrders: current.recentOrders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      ),
      analytics: {
        ...current.analytics,
        orderStatusCounts: adjustStatusCounts(current.analytics.orderStatusCounts, previousStatus, status)
      }
    }));

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

      setDashboard((current) => ({
        ...current,
        recentOrders: current.recentOrders.map((order) =>
          order._id === orderId ? json.order : order
        )
      }));
      toast.success('Order status updated');
    } catch (error) {
      console.error(error);
      setDashboard(previousDashboard);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading" role="status">
        <div className="spinner-border text-success" />
        <span>Preparing your dashboard…</span>
      </div>
    );
  }

  const statusCounts = {
    ...initialDashboard.analytics.orderStatusCounts,
    ...(dashboard.analytics.orderStatusCounts || {})
  };

  const metrics = [
    { label: 'Total Orders', value: dashboard.totalOrders, icon: <ReceiptLongRounded />, tone: 'orange', link: '/admin/orders' },
    { label: 'Pending Orders', value: statusCounts.Pending, icon: <ShoppingBagRounded />, tone: 'orange' },
    { label: 'Preparing Orders', value: statusCounts.Preparing, icon: <RestaurantMenuRounded />, tone: 'blue' },
    { label: 'Delivered Orders', value: statusCounts.Delivered, icon: <ReceiptLongRounded />, tone: 'green' },
    { label: 'Total Revenue', value: currency.format(dashboard.totalRevenue), icon: <PaymentsRounded />, tone: 'green' },
    { label: 'Registered Users', value: dashboard.totalUsers, icon: <PeopleAltRounded />, tone: 'blue' },
    { label: 'Menu Items', value: dashboard.totalFoods, icon: <RestaurantMenuRounded />, tone: 'purple', link: '/admin/foods' },
    { label: 'Categories', value: dashboard.totalCategories, icon: <CategoryRounded />, tone: 'pink', link: '/admin/categories' }
  ];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__title"><span>GF</span><div><strong>GoFood</strong><small>Admin workspace</small></div></div>
        <nav aria-label="Admin navigation">
          <Link className="active" to="/admin"><DashboardRounded /> Overview</Link>
          <Link to="/admin/foods"><RestaurantMenuRounded /> Food items</Link>
          <Link to="/admin/categories"><CategoryRounded /> Categories</Link>
          <Link to="/admin/orders"><ReceiptLongRounded /> Orders</Link>
        </nav>
        <div className="admin-sidebar__help"><strong>Keep your menu fresh</strong><span>Add seasonal dishes and delight your customers.</span><Link to="/admin/foods">Add an item</Link></div>
      </aside>
      <main className="admin-dashboard">
      <div className="admin-dashboard__header">
        <div>
          <div className="admin-eyebrow"><DashboardRounded fontSize="small" /> Overview</div>
          <h1>Admin Dashboard</h1>
          <p>Here’s what’s happening with your restaurant today.</p>
        </div>
        <div className="admin-header-actions">
          <Link to="/admin/categories" className="btn btn-light">Manage categories</Link>
          <Link to="/admin/foods" className="btn btn-success">+ Add food item</Link>
        </div>
      </div>

      <section className="metric-grid" aria-label="Business metrics">
        {metrics.map((metric) => {
          const content = (
            <>
              <span className={`metric-icon metric-icon--${metric.tone}`}>{metric.icon}</span>
              <div><span>{metric.label}</span><strong>{metric.value}</strong></div>
            </>
          );
          return metric.link ? (
            <Link className="metric-card" to={metric.link} key={metric.label}>{content}</Link>
          ) : (
            <div className="metric-card" key={metric.label}>{content}</div>
          );
        })}
      </section>

      <section className="dashboard-grid dashboard-grid--analytics">
        <article className="dashboard-panel dashboard-panel--wide">
          <div className="panel-heading">
            <div><h2>Orders & revenue</h2><p>Performance over the last 7 days</p></div>
            <span className="panel-chip">Last 7 days</span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.analytics.lastSevenDays} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22a06b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22a06b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e8ece9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#748078', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#748078', fontSize: 12 }} />
                <Tooltip formatter={(value, name) => [name === 'revenue' ? currency.format(value) : value, name === 'revenue' ? 'Revenue' : 'Orders']} />
                <Area type="monotone" dataKey="revenue" stroke="#168653" strokeWidth={3} fill="url(#revenueFill)" />
                <Area type="monotone" dataKey="orders" stroke="#f2994a" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend"><span className="revenue-dot">Revenue</span><span className="orders-dot">Orders</span></div>
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading"><div><h2>Popular dishes</h2><p>Most ordered items</p></div></div>
          {dashboard.analytics.mostOrderedItems.length ? (
            <div className="chart-wrap chart-wrap--bar">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.analytics.mostOrderedItems} layout="vertical" margin={{ top: 5, right: 15, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="#e8ece9" />
                  <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" width={92} axisLine={false} tickLine={false} tick={{ fill: '#58625c', fontSize: 11 }} />
                  <Tooltip cursor={{ fill: '#f4f8f5' }} />
                  <Bar dataKey="orders" name="Items ordered" fill="#f2994a" radius={[0, 7, 7, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <div className="panel-empty">Popular items will appear after the first order.</div>}
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--activity">
        <article className="dashboard-panel dashboard-panel--wide">
          <div className="panel-heading"><div><h2>Recent orders</h2><p>The latest customer purchases</p></div><Link to="/admin/orders">View all</Link></div>
          <div className="table-responsive recent-orders-table">
            <table className="table align-middle mb-0">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {dashboard.recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td><span className="order-id">#{order._id.slice(-7).toUpperCase()}</span></td>
                    <td><strong>{order.userId?.name || 'Customer'}</strong><small>{order.userId?.email || ''}</small></td>
                    <td>{currency.format(order.totalPrice || 0)}</td>
                    <td>
                      <div className="order-status-control">
                        <span className={statusClassName(order.status || order.orderStatus)}>{normalizeOrderStatus(order.status || order.orderStatus)}</span>
                        <select
                          className="form-select form-select-sm order-status-select"
                          value={normalizeOrderStatus(order.status || order.orderStatus)}
                          disabled={updatingOrderId === order._id}
                          onChange={(event) => handleOrderStatusChange(order._id, event.target.value)}
                          aria-label={`Update status for order ${order._id.slice(-7).toUpperCase()}`}
                        >
                          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </div>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
                {!dashboard.recentOrders.length && <tr><td colSpan="5" className="panel-empty">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-panel activity-panel">
          <div className="panel-heading"><div><h2>Recent activity</h2><p>Latest updates across the app</p></div></div>
          <div className="activity-feed">
            {dashboard.activities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <span className={`activity-icon activity-icon--${activity.type}`}>{activityIcons[activity.type]}</span>
                <div><strong>{activity.message}</strong><span>{relativeTime(activity.createdAt)}</span></div>
              </div>
            ))}
            {!dashboard.activities.length && <div className="panel-empty">Activity will show up here.</div>}
          </div>
        </article>
      </section>

      <section className="dashboard-panel user-panel">
        <div className="panel-heading">
          <div><h2>User activity</h2><p>Your newest members at a glance</p></div>
          <div className="user-summary"><span><strong>{dashboard.totalUsers}</strong>Total users</span><span><strong>+{dashboard.newUsersThisWeek}</strong>New this week</span></div>
        </div>
        <div className="recent-users">
          {dashboard.recentUsers.map((user) => (
            <div className="recent-user" key={user._id}>
              <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
              <div><strong>{user.name}</strong><span>{user.email}</span></div>
              <time>{formatDate(user.date)}</time>
            </div>
          ))}
          {!dashboard.recentUsers.length && <div className="panel-empty">No registered users yet.</div>}
        </div>
      </section>
      </main>
    </div>
  );
}
