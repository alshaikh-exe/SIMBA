// src/pages/Booking/CartPage/CartPage.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Cart from "../../../components/Booking/Cart/Cart";
import { useNavigate } from "react-router-dom";

export default function CartPage({ user, onCartUpdate }) {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const navigate = useNavigate();

  const handleSaveDates = async () => {
    if (!pickupDate || !returnDate) {
      alert("Please select both pickup and return dates");
      return;
    }

    const res = await fetch("/api/orders/set-dates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        pickupDate,
        returnDate,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Dates saved successfully");
    } else {
      alert(data.message || "Error saving dates");
    }
  };

  const handleCheckout = async () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!cart.length) {
        alert("Your cart is empty");
        return;
      }

      if (!pickupDate || !returnDate) {
        alert("Please select both pickup and return dates before checkout");
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cartItems: cart,
          pickupDate,
          returnDate,
        }),
      });

      if (!res.ok) {
        const text = await res.text(); // handle non-JSON response
        throw new Error(text || "Checkout failed");
      }

      const order = await res.json();
      localStorage.removeItem("cart"); // clear cart after checkout
      onCartUpdate?.(); // update parent state if needed
      navigate(`/orders/${order._id}`); // redirect to order page
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <Cart user={user} onCartUpdate={onCartUpdate} />
      <div>
        <h2>Choose Your Dates</h2>
        <div>
          <label>Pickup Date:</label>
          <DatePicker
            selected={pickupDate}
            onChange={(date) => setPickupDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div>
          <label>Return Date:</label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <button onClick={handleSaveDates}>Save Dates</button>
        <button onClick={handleCheckout} style={{ marginLeft: "1rem" }}>
          Checkout
        </button>

        {pickupDate && returnDate && (
          <div>
            <p>Pickup: {pickupDate.toDateString()}</p>
            <p>Return: {returnDate.toDateString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}
