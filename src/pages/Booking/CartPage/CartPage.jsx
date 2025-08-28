// src/pages/Booking/CartPage/CartPage.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cart from "../../../components/Booking/Cart/Cart";
import styles from "./CartPage.module.scss";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000";

export default function CartPage({ user, onCartUpdate }) {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

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
          if (data.data.pickupDate) setPickupDate(new Date(data.data.pickupDate));
          if (data.data.returnDate) setReturnDate(new Date(data.data.returnDate));
        }
      } catch (err) {
        console.error("Failed to load cart dates", err);
      }
    };
    loadCart();
  }, []);

  const handleSaveDates = async () => {
    if (!pickupDate || !returnDate) return alert("Please select both pickup and return dates");
    if (returnDate < pickupDate) return alert("Return date cannot be before pickup date");

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
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (!savedCart.length) return alert("Your cart is empty");
    if (!pickupDate || !returnDate) return alert("Select both pickup and return dates");

    const requestedDays = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));

    try {
      for (const item of savedCart) {
        await fetch(`${API_BASE}/api/orders/cart/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ itemId: item._id }),
        });
      }

      const lines = savedCart.map(item => ({
        item: item._id,
        requestedDays: requestedDays || 1,
      }));

      const res = await fetch(`${API_BASE}/api/orders/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ lines }),
      });

      const data = await res.json();
      console.log("Order submitted:", data);

      if (res.ok && data.success) {
        alert("Order submitted successfully!");
        localStorage.removeItem("cart");
        onCartUpdate && onCartUpdate();
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed, see console");
    }
  };

  return (
    <div className={styles["cart-container"]}>
      <Cart user={user} onCartUpdate={onCartUpdate} />

      <div className={styles["cart-header"]}>
        <h2>Choose Your Dates</h2>
      </div>

      <div className={styles["cart-items"]}>
        {/* Pickup Date */}
        <div className={styles["cart-item"]}>
          <div className={styles["item-info"]}>
            <label>Pickup Date:</label>
            <div className={styles["neu-input"]}>
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
          </div>
        </div>

        {/* Return Date */}
        <div className={styles["cart-item"]}>
          <div className={styles["item-info"]}>
            <label>Return Date:</label>
            <div className={styles["neu-input"]}>
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
          </div>
        </div>

        {/* Save Dates Button */}
        <div className={`${styles["cart-item"]} ${styles["item-actions"]}`}>
          <button className={styles["neu-button"]} onClick={handleSaveDates}>
            Save Dates
          </button>
        </div>

        {/* Preview Dates */}
        {pickupDate && returnDate && (
          <div className={styles["cart-item"]}>
            <p>Pickup: {pickupDate.toDateString()}</p>
            <p>Return: {returnDate.toDateString()}</p>
          </div>
        )}

        {/* Checkout Button */}
        <div className={`${styles["cart-item"]} ${styles["item-actions"]}`}>
          <button className={styles["neu-button"]} onClick={handleCheckout}>
  Checkout
</button>
        </div>
      </div>
    </div>
  );
}