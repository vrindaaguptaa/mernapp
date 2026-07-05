import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReceiptLongRounded from '@mui/icons-material/ReceiptLongRounded';
import LocalShippingRounded from '@mui/icons-material/LocalShippingRounded';
import { buildApiUrl, parseApiResponse } from '../utils/api';

const normalizeOrderStatus = (status) => (status === 'Placed' || !status ? 'Pending' : status);

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(buildApiUrl(`/api/order/${id}`), { headers: { 'auth-token': token } });
        const json = await parseApiResponse(res, 'Failed to fetch order');
        if (!json?.success) throw new Error(json?.message || 'Failed to fetch order');
        setOrder(json.order);
      } catch (err) {
        const message = err.message || 'Failed to load';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  if (loading) return <div className="container page-section"><div className="text-center"><div className="spinner-border text-brand" role="status" /><div className="mt-3 text-muted">Loading your order details…</div></div></div>;
  if (error) return <div className="container page-section"><div className="error-state"><strong>We couldn’t load this order.</strong><span>{error}</span><button className="btn btn-brand" onClick={() => window.location.reload()}>Retry</button></div></div>;
  if (!order) return null;

  return (
    <div className="container page-section">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <div className="section-kicker">Order details</div>
                  <h2 className="mb-2">Order #{order._id.slice(-6).toUpperCase()}</h2>
                  <p className="text-muted mb-0">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="text-md-end">
                  <span className={`customer-order-status customer-order-status--${normalizeOrderStatus(order.status || order.orderStatus).toLowerCase().replace(/\s/g, '-')}`}>
                    {normalizeOrderStatus(order.status || order.orderStatus)}
                  </span>
                  <div className="mt-2 fw-bold">₹{order.totalPrice}</div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="info-card">
                    <ReceiptLongRounded />
                    <div>
                      <div className="info-label">Payment</div>
                      <div className="info-value">{order.paymentStatus || 'pending'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="info-card">
                    <LocalShippingRounded />
                    <div>
                      <div className="info-label">Tracking</div>
                      <div className="info-value">Live updates enabled</div>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className="mb-3">Items</h5>
              <div className="order-items-list">
                {order.orderedItems.map((it, idx) => (
                  <div key={idx} className="order-item-row">
                    <div>
                      <div className="fw-bold text-dark">{it.name}</div>
                      <div className="small text-muted">Size: {it.size || 'Standard'} • Unit ₹{it.unitPrice}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-semibold">Qty: {it.qty}</div>
                      <div className="small text-muted">₹{it.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between align-items-center border-top mt-4 pt-3">
                <div className="fw-bold">Total</div>
                <div className="fw-bold fs-5">₹{order.totalPrice}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
