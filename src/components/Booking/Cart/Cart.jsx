import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button/Button';
import './Cart.module.scss';

export default function Cart({ user, onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    onCartUpdate && onCartUpdate();
  };

  const incrementItem = async (item) => {
    if (item.quantity <= 0) return;

    try {
      // decrement quantity in items database
      await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: item.quantity - 1 })
      });

      const updatedCart = cartItems.map(i =>
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      );
      updateCart(updatedCart);
    } catch (err) {
      console.error(err);
    }
  };

  const decrementItem = async (item) => {
    try {
      // increment quantity in items database
      await fetch(`/api/items/${item._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ quantity: item.quantity + 1 })
      });

      let updatedCart;
      if (item.quantity === 1) {
        updatedCart = cartItems.filter(i => i._id !== item._id);
      } else {
        updatedCart = cartItems.map(i =>
          i._id === item._id ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      updateCart(updatedCart);
    } catch (err) {
      console.error(err);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart is Empty</h2>
        <p>Add some equipment to your cart.</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems.map(item => (
        <div key={item._id} className="cart-item">
          <div className="item-image">
            {item.picture ? <img src={item.picture} alt={item.name} /> : <div>No Image</div>}
          </div>
          <div className="item-details">
            <h3>{item.name}</h3>
            <p>Quantity: {item.quantity}</p>
          </div>
          <div className="item-actions">
            <Button onClick={() => incrementItem(item)}>+</Button>
            <Button onClick={() => decrementItem(item)}>-</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
