import React, { createContext, useContext, useReducer } from 'react';

const CartStateContext = createContext();
const CartDispatchContext = createContext();

const initialCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  return cart;
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const existingIndex = state.findIndex(
        (item) => item.id === action.id && item.size === action.size
      );
      if (existingIndex !== -1) {
        const updated = [...state];
        const existing = updated[existingIndex];
        const newQty = existing.qty + action.qty;
        updated[existingIndex] = {
          ...existing,
          qty: newQty,
          price: existing.unitPrice * newQty
        };
        return saveCart(updated);
      }
      return saveCart([
        ...state,
        {
          id: action.id,
          name: action.name,
          qty: action.qty,
          size: action.size,
          price: action.price,
          unitPrice: action.unitPrice,
          img: action.img
        }
      ]);
    }
    case 'REMOVE': {
      const newArr = state.filter((_, index) => index !== action.index);
      return saveCart(newArr);
    }
    case 'UPDATE': {
      const updated = state.map((item) => {
        if (item.id === action.id && item.size === action.size) {
          return {
            ...item,
            qty: action.qty,
            price: item.unitPrice * action.qty
          };
        }
        return item;
      });
      return saveCart(updated);
    }
    case 'DROP': {
      return saveCart([]);
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [], initialCart);
  return (
    <CartDispatchContext.Provider value={dispatch}>
      <CartStateContext.Provider value={state}>{children}</CartStateContext.Provider>
    </CartDispatchContext.Provider>
  );
};

export const useCart = () => useContext(CartStateContext);
export const useDispatchCart = () => useContext(CartDispatchContext);
