// src/pages/Booking/CartPage/CartPage.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cart from "../../../components/Booking/Cart/Cart";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function CartPage({ user, onCartUpdate }) {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  // optional: preload existing saved dates from the cart
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/orders/cart`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok && data?.data) {
          if (data.data.pickupDate) {
            setPickupDate(new Date(data.data.pickupDate));
          }
          if (data.data.returnDate) {
            setReturnDate(new Date(data.data.returnDate));
          }
        }
      } catch (err) {
        console.error("Failed to load cart dates", err);
      }
    };
    loadCart();
  }, []);

  const handleSaveDates = async () => {
    if (!pickupDate || !returnDate) {
      alert("Please select both pickup and return dates");
      return;
    }
    if (returnDate < pickupDate) {
      alert("Return date cannot be before pickup date");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/orders/cart/set-dates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          pickupDate: pickupDate.toISOString(),
          returnDate: returnDate.toISOString(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        alert("Cart dates saved successfully");
        onCartUpdate && onCartUpdate();
      } else {
        alert(data.message || data.error || "Error saving dates");
      }
    } catch (err) {
      console.error("Save dates error:", err);
      alert("Request failed, check console");
    }
  };

const handleCheckout = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/orders/submit`, {   // 👈 use submit
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        pickupDate: pickupDate?.toISOString(),
        returnDate: returnDate?.toISOString(),
      }),
    });

    const data = await res.json();
    console.log("Order submitted:", data);
  } catch (err) {
    console.error("Checkout failed", err);
  }
};

  return (
    <div style={{ padding: "1rem" }}>
      {/* Cart items */}
      <Cart user={user} onCartUpdate={onCartUpdate} />

      <div>
        <h2>Choose Your Dates</h2>

        {/* Pickup date picker */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Pickup Date:
          </label>
          <DatePicker
            selected={pickupDate}
            onChange={(date) => {
              setPickupDate(date);
              if (returnDate && date && returnDate < date) setReturnDate(null);
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select pickup date"
            minDate={new Date()}
            isClearable
          />
        </div>

        {/* Return date picker */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Return Date:
          </label>
          <DatePicker
            selected={returnDate}
            onChange={(date) => setReturnDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select return date"
            minDate={pickupDate || new Date()}
            disabled={!pickupDate}
            isClearable
          />
        </div>

        {/* Save button */}
        <button onClick={handleSaveDates}>Save Dates</button>

        {/* Preview */}
        {pickupDate && returnDate && (
          <div style={{ marginTop: 12 }}>
            <p>Pickup: {pickupDate.toDateString()}</p>
            <p>Return: {returnDate.toDateString()}</p>
          </div>
        )}

        {/* Checkout button */}
        <div style={{ marginTop: 20 }}>
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      </div>
    </div>
  );
}
