//Zahraa
import React, { useState } from "react";

const Cart = ({ user }) => {
  const [cartItems, setCartItems] = useState([]);

  return (
    <div>
      <h2>Shopping Cart</h2>
      <p>User: {user?.name || "Guest"}</p>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item, index) => (
            <div key={index} style={{ padding: "10px", border: "1px solid #ccc", margin: "5px" }}>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
          ))}
        </div>
      )}
      <button>Checkout</button>
    </div>
  );
};

export default Cart;