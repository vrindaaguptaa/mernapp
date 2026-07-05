import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatchCart } from './ContextReducer';
import { toast, Slide } from 'react-toastify';
import StarRounded from '@mui/icons-material/StarRounded';
import AddShoppingCartRounded from '@mui/icons-material/AddShoppingCartRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import 'react-toastify/dist/ReactToastify.css';

export default function Card({ foodItem, options }) {
  const dispatch = useDispatchCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const addedTimer = useRef(null);

  const priceOptions = useMemo(() => Object.keys(options || {}), [options]);
  const selectedSize = size || priceOptions[0] || '';
  const unitPrice = parseInt(options?.[selectedSize] || 0, 10);
  const finalPrice = qty * unitPrice;

  useEffect(() => {
    if (priceOptions.length > 0 && !priceOptions.includes(size)) {
      setSize(priceOptions[0]);
    }
  }, [priceOptions, size]);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const handleAddToCart = () => {
    if (!localStorage.getItem('authToken')) {
      navigate('/login');
      return;
    }

    dispatch({
      type: 'ADD',
      id: foodItem._id,
      name: foodItem.name,
      qty,
      size: selectedSize,
      price: finalPrice,
      unitPrice,
      img: foodItem.img
    });

    setJustAdded(true);
    clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setJustAdded(false), 1400);

    toast.success('Added to cart', {
      position: 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      transition: Slide,
      theme: 'colored'
    });
  };

  return (
    <article className="card card-food h-100 border-0 bg-white">
      <div className="card-img-wrapper">
        <img
          src={foodItem.img || '/fallback-food.jpg'}
          className="card-img-top"
          alt={foodItem.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://via.placeholder.com/400x180?text=No+Image';
          }}
        />
        <span className="food-rating"><StarRounded /> {Number(foodItem.rating || 4.5).toFixed(1)}</span>
        <span className="food-category">{foodItem.CategoryName || 'Popular'}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{foodItem.name}</h3>
        <p className="card-text">
          {foodItem.description || 'Delicious food item made with fresh ingredients.'}
        </p>

        <div className="food-options">
          <div className="quantity-select">
            <label htmlFor={`qty-${foodItem._id}`}>Qty</label>
            <select
              id={`qty-${foodItem._id}`}
              className="form-select form-select-sm"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="size-options">
            {priceOptions.length === 0 ? (
              <span className="text-muted small">No sizes</span>
            ) : (
              priceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`btn btn-sm size-pill ${selectedSize === option ? 'active' : 'btn-outline-success'}`}
                  onClick={() => setSize(option)}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="food-card-footer">
          <div className="food-price"><strong>₹{finalPrice}</strong><span>₹{unitPrice} each</span></div>
          <button className={`btn add-cart-btn ${justAdded ? 'is-added' : ''}`} onClick={handleAddToCart} disabled={!unitPrice}>
            {justAdded ? <><CheckRounded /> Added</> : <><AddShoppingCartRounded /> Add</>}
          </button>
        </div>
      </div>
    </article>
  );
}
