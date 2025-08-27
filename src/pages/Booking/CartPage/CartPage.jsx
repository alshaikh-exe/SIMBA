// src/pages/Booking/CartPage/CartPage.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Cart from "../../../components/Booking/Cart/Cart";

export default function CartPage({ user, onCartUpdate }) {
   const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

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
