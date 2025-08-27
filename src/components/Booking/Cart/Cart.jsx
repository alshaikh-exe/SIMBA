// src/components/Booking/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import './Cart.module.scss';

export default function Cart({ user, onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

  // Load cart items for the current user
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = () => {
    if (!user) return setCartItems([]);
    const storedCart = localStorage.getItem(`cart_${user._id}`);
    const cart = storedCart ? JSON.parse(storedCart) : [];
    setCartItems(cart);
  };

  const handleIncrement = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
    onCartUpdate && onCartUpdate(itemId, 'decrement'); // decrease in items page
  };

  const handleDecrement = (itemId) => {
    let updatedCart = cartItems.map(item =>
      item._id === itemId ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
    onCartUpdate && onCartUpdate(itemId, 'increment'); // increase in items page
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem(`cart_${user._id}`, JSON.stringify(updatedCart));
    onCartUpdate && onCartUpdate(itemId, 'increment'); // restore quantity in items page
  };

  if (!user) {
    return (
      <div className="cart-container">
        <p>Please log in to view your cart.</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart ({cartItems.length} {cartItems.length !== 1 ? 'items' : 'item'})</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <div className="item-image">
              {item.picture ? (
                <img src={item.picture} alt={item.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>

            <div className="item-details">
              <h3>{item.name}</h3>
              <p>Quantity: {item.quantity}</p>

              <div className="item-actions">
                <Button size="small" onClick={() => handleIncrement(item._id)}>+</Button>
                <Button size="small" onClick={() => handleDecrement(item._id)} disabled={item.quantity === 1}>-</Button>
                <Button variant="danger" size="small" onClick={() => handleRemoveItem(item._id)}>Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
