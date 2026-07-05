import React, { useState } from 'react';
import Delete from '@mui/icons-material/Delete';
import ShoppingBagRounded from '@mui/icons-material/ShoppingBagRounded';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import { toast } from 'react-toastify';
import { buildApiUrl, parseApiResponse } from '../utils/api';

export default function Cart() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);

  const handleRemove = (index) => {
    dispatch({ type: 'REMOVE', index });
  };

  const handleQuantityChange = (item, delta) => {
    const newQty = item.qty + delta;
    if (newQty < 1) return;
    dispatch({ type: 'UPDATE', id: item.id, size: item.size, qty: newQty });
  };

  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  const placeOrder = async () => {
    if (!data.length || placingOrder) return;
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.info('Please log in to place your order');
      navigate('/login');
      return;
    }

    try {
      setPlacingOrder(true);
      const response = await fetch(buildApiUrl('/api/orders'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': authToken
        },
        body: JSON.stringify({ orderedItems: data, totalPrice: totalPrice + 40 })
      });
      const json = await parseApiResponse(response, 'Unable to place order');
      if (!json?.success) throw new Error(json?.message || 'Order failed');

      dispatch({ type: 'DROP' });
      toast.success('Order placed successfully');
      navigate('/orders');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (data.length === 0) {
    return (
      <div className="container page-section"><div className="empty-state modern-empty full-page-empty">
        <span className="empty-state-icon"><ShoppingBagRounded /></span>
        <h2>Your cart is waiting</h2>
        <p>Good food is only a few taps away. Explore the menu and add something delicious.</p>
        <button className="btn btn-brand" onClick={() => navigate('/')}>Browse the menu</button>
      </div></div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h2 className="card-title mb-4">Cart Summary</h2>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={`${item.id}-${item.size}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item, -1)}>-</button>
                            <span>{item.qty}</span>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityChange(item, 1)}>+</button>
                          </div>
                        </td>
                        <td>{item.size}</td>
                        <td>₹{item.price}</td>
                        <td>
                          <button className="btn btn-link text-danger p-0" onClick={() => handleRemove(index)}>
                            <Delete />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '80px' }}>
            <div className="card-body">
              <h4 className="card-title">Checkout</h4>
              <p className="text-muted">Confirm your order before placing it.</p>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <strong>₹{totalPrice}</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Delivery</span>
                <strong>₹40</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Total</span>
                <strong>₹{totalPrice + 40}</strong>
              </div>
              <button
                className="btn btn-success w-100 py-2 fw-semibold"
                onClick={placeOrder}
                disabled={placingOrder}
              >
                {placingOrder ? (
                  <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Placing order…</>
                ) : 'Place Order'}
              </button>
              <Link to="/" className="btn btn-outline-secondary w-100 mt-3">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
    
