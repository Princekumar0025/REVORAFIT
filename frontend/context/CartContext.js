'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i._id === action.payload._id && i.selectedVariant === action.payload.selectedVariant
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i._id === action.payload._id && i.selectedVariant === action.payload.selectedVariant
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }] };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          (i) => !(i._id === action.payload._id && i.selectedVariant === action.payload.selectedVariant)
        ),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload._id && i.selectedVariant === action.payload.selectedVariant
            ? { ...i, quantity: action.payload.quantity }
            : i
        ),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_COUPON':
      return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':
      return { ...state, coupon: null };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

const initialState = { items: [], coupon: null };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('revorafit_cart');
      if (saved) dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) });
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('revorafit_cart', JSON.stringify(state));
  }, [state]);

  const subtotal = state.items.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const itemCount = state.items.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const discount = state.coupon?.discount || 0;
  const total = subtotal + shippingCharge - discount;

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        subtotal,
        itemCount,
        shippingCharge,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
