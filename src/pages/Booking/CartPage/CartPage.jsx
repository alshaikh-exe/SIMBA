// src/pages/Booking/CartPage/CartPage.jsx
import React from "react";
import Cart from "../../../components/Booking/Cart/Cart";

export default function CartPage({ user, onCartUpdate }) {
  return (
    <div style={{ padding: "1rem" }}>
      <Cart user={user} onCartUpdate={onCartUpdate} />
    </div>
  );
}
