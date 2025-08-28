import React, { useState, useEffect } from 'react';
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
      <div className="cart">
        <h2 className="cart__title">Your Cart</h2>
        <div className="cart__empty">
          <h2>Your Cart is Empty</h2>
          <p>Add some equipment to your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2 className="cart__title">Your Cart</h2>

      <div className="cart__list">
        {cartItems.map(item => (
          <div key={item._id} className="cartCard">
            <div className="cartCard__grid">
              {/* Image */}
              <div className="cartCard__image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="placeholder">No Image</div>
                )}
              </div>

              {/* Name + quantity controls */}
              <div className="cartCard__details">
                <p className="cartCard__name">{item.name}</p>
                <div className="cartCard__qty">
                  <button className="qtyBtn" onClick={() => decrementItem(item)}>
                    –
                  </button>
                  <span className="qtyBadge">{item.quantity}</span>
                  <button className="qtyBtn" onClick={() => incrementItem(item)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}





