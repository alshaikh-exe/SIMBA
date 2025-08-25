// //Zahraa
// import React from "react";
// import NavBar from "../../../components/Navbar/Navbar";
// // import Cart from "../../../components/Booking/Cart/Cart";

// const CartPage = ({ user, setUser }) => {
//   return (
//     <main>
//       <aside>
//         <NavBar user={user} setUser={setUser} />
//       </aside>
//       <div>
//         <h1>Shopping Cart</h1>
//         <Cart user={user} />
//       </div>
//     </main>
//   );
// };

// export default CartPage;
// src/components/Booking/Cart/Cart.jsx
import React, { useState, useEffect } from 'react';
import { createOrder, removeFromCart, getCartItems } from '../../../utilities/equipment-api';
import Calendar from '../../../components/Calendar/Calendar';
import Button from '../../../components/Button/Button';
import './CartPage.module.scss';

export default function Cart({ user, onCartUpdate }) {
  const [cartItems, setCartItems] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (err) {
      setError('Failed to load cart items');
      console.error(err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item._id !== itemId));
      const updatedDates = { ...selectedDates };
      delete updatedDates[itemId];
      setSelectedDates(updatedDates);
      onCartUpdate && onCartUpdate();
    } catch (err) {
      setError('Failed to remove item from cart');
      console.error(err);
    }
  };

  const handleDateChange = (itemId, dateRange) => {
    setSelectedDates({
      ...selectedDates,
      [itemId]: dateRange
    });
  };

  const validateBooking = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return false;
    }

    for (const item of cartItems) {
      if (!selectedDates[item._id]) {
        setError(`Please select dates for ${item.name}`);
        return false;
      }

      const { startDate, endDate, startTime, endTime } = selectedDates[item._id];
      if (!startDate || !endDate || !startTime || !endTime) {
        setError(`Please complete date and time selection for ${item.name}`);
        return false;
      }

      // Validate that end time is after start time
      if (startDate === endDate && startTime >= endTime) {
        setError(`End time must be after start time for ${item.name}`);
        return false;
      }

      // Validate that booking is in the future
      const now = new Date();
      const bookingStart = new Date(`${startDate}T${startTime}`);
      if (bookingStart <= now) {
        setError(`Booking time must be in the future for ${item.name}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmitOrder = async () => {
    if (!validateBooking()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const orderData = {
        items: cartItems.map(item => ({
          itemId: item._id,
          ...selectedDates[item._id]
        })),
        userId: user._id,
        totalItems: cartItems.length
      };

      await createOrder(orderData);
      setSuccess('Booking request submitted successfully!');
      setCartItems([]);
      setSelectedDates({});
      onCartUpdate && onCartUpdate();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to submit booking request');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalHours = () => {
    return cartItems.reduce((total, item) => {
      const dates = selectedDates[item._id];
      if (!dates || !dates.startDate || !dates.endDate || !dates.startTime || !dates.endTime) {
        return total;
      }

      const start = new Date(`${dates.startDate}T${dates.startTime}`);
      const end = new Date(`${dates.endDate}T${dates.endTime}`);
      const hours = (end - start) / (1000 * 60 * 60);
      return total + Math.max(0, hours);
    }, 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-header">
          <h2>Your Booking Cart</h2>
        </div>
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Browse the equipment catalog to add items to your cart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Your Booking Cart</h2>
        <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item._id} className="cart-item">
            <div className="item-info">
              <div className="item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="item-category">{item.category}</span>
              </div>
            </div>

            <div className="booking-section">
              <h4>Select Booking Time</h4>
              <Calendar
                item={item}
                onDateChange={(dateRange) => handleDateChange(item._id, dateRange)}
                selectedDates={selectedDates[item._id]}
              />
              
              {selectedDates[item._id] && (
                <div className="selected-time">
                  <p>
                    <strong>Selected:</strong> {selectedDates[item._id].startDate} 
                    {selectedDates[item._id].startDate !== selectedDates[item._id].endDate && 
                      ` - ${selectedDates[item._id].endDate}`
                    }
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedDates[item._id].startTime} - {selectedDates[item._id].endTime}
                  </p>
                </div>
              )}
            </div>

            <div className="item-actions">
              <Button
                variant="danger"
                onClick={() => handleRemoveItem(item._id)}
                size="small"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-details">
          <h3>Booking Summary</h3>
          <p><strong>Total Items:</strong> {cartItems.length}</p>
          <p><strong>Total Hours:</strong> {calculateTotalHours().toFixed(1)} hours</p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmitOrder}
          loading={loading}
          disabled={loading}
          size="large"
        >
          {loading ? 'Submitting...' : 'Submit Booking Request'}
        </Button>
      </div>
    </div>
  );
}