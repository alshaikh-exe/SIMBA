//Zahraa
import React from "react";
import NavBar from "../../../components/Navbar/Navbar";

const ItemsShowPage = ({ user, setUser }) => {
  return (
    <main>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <div>
        <h1>Item Details</h1>
        {/* Add your item details component here */}
      </div>
    </main>
  );
};

export default ItemsShowPage;
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import './ItemsShowPage.scss';
// import Button from '../../../components/Button/Button';
// import Calendar from '../../../components/Calendar/Calendar';

// const ItemsShowPage = ({ user, cart, setCart }) => {
//   const { id } = useParams();
//   const navigate = useNavigate();
  
//   const [equipment, setEquipment] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [bookingHistory, setBookingHistory] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedTime, setSelectedTime] = useState('');
//   const [bookingNotes, setBookingNotes] = useState('');
//   const [quantity, setQuantity] = useState(1);
//   const [showBookingForm, setShowBookingForm] = useState(false);

//   useEffect(() => {
//     fetchEquipment();
//     fetchBookingHistory();
//   }, [id]);

//   const fetchEquipment = async () => {
//     try {
//       const response = await fetch(`/api/items/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setEquipment(data);
//       } else if (response.status === 404) {
//         alert('Equipment not found');
//         navigate('/equipment');
//       }
//     } catch (error) {
//       console.error('Error fetching equipment:', error);
//       alert('Error loading equipment details');
//     }
//     setLoading(false);
//   };

//   const fetchBookingHistory = async () => {
//     try {
//       const response = await fetch(`/api/orders/equipment/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setBookingHistory(data);
//       }
//     } catch (error) {
//       console.error('Error fetching booking history:', error);
//     }
//   };

//   const addToCart = () => {
//     const existingItem = cart.find(cartItem => cartItem._id === equipment._id);
    
//     if (existingItem) {
//       setCart(cart.map(cartItem => 
//         cartItem._id === equipment._id 
//           ? { ...cartItem, quantity: cartItem.quantity + quantity }
//           : cartItem
//       ));
//     } else {
//       setCart([...cart, { ...equipment, quantity }]);
//     }
    
//     alert(`Added ${equipment.name} to cart!`);
//   };

//   const quickBook = async () => {
//     if (!selectedDate || !selectedTime) {
//       alert('Please select both date and time');
//       return;
//     }

//     try {
//       const bookingData = {
//         items: [{
//           equipmentId: equipment._id,
//           equipmentName: equipment.name,
//           quantity: quantity,
//           bookingDate: selectedDate,
//           bookingTime: selectedTime,
//           notes: bookingNotes,
//           requiresApproval: equipment.requiresApproval || false
//         }],
//         userId: user._id
//       };

//       const response = await fetch('/api/orders', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify(bookingData)
//       });

//       if (response.ok) {
//         alert('Booking request submitted successfully!');
//         setShowBookingForm(false);
//         setSelectedDate(null);
//         setSelectedTime('');
//         setBookingNotes('');
//         setQuantity(1);
//         fetchBookingHistory();
//       } else {
//         throw new Error('Failed to submit booking');
//       }
//     } catch (error) {
//       alert('Error submitting booking: ' + error.message);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'available': return 'green';
//       case 'reserved': return 'blue';
//       case 'maintenance': return 'orange';
//       case 'repair': return 'red';
//       case 'out of order': return 'red';
//       default: return 'green';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status?.toLowerCase()) {
//       case 'available': return '✅';
//       case 'reserved': return '📅';
//       case 'maintenance': return '🔧';
//       case 'repair': return '⚠️';
//       case 'out of order': return '❌';
//       default: return '✅';
//     }
//   };

//   const isItemAvailable = () => {
//     const status = equipment?.status?.toLowerCase() || 'available';
//     return status === 'available';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const timeSlots = [
//     '08:00', '09:00', '10:00', '11:00', '12:00',
//     '13:00', '14:00', '15:00', '16:00', '17:00'
//   ];

//   if (loading) {
//     return (
//       <div className="items-show-page">
//         <div className="loading">Loading equipment details...</div>
//       </div>
//     );
//   }

//   if (!equipment) {
//     return (
//       <div className="items-show-page">
//         <div className="not-found">
//           <h2>Equipment not found</h2>
//           <Button onClick={() => navigate('/equipment')} className="primary">
//             Back to Equipment
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="items-show-page">
//       <div className="page-header">
//         <Button onClick={() => navigate('/equipment')} className="back-btn secondary">
//           ← Back to Equipment
//         </Button>
        
//         {(user.role === 'manager' || user.role === 'admin') && (
//           <Button onClick={() => navigate(`/equipment/${id}/edit`)} className="edit-btn secondary">
//             Edit Equipment
//           </Button>
//         )}
//       </div>

//       <div className="equipment-details">
//         <div className="equipment-main">
//           <div className="equipment-image">
//             {equipment.image ? (
//               <img src={equipment.image} alt={equipment.name} />
//             ) : (
//               <div className="placeholder-image">
//                 <span className="equipment-icon">
//                   {equipment.category === 'Electronics' ? '🔌' :
//                    equipment.category === '3D Printing' ? '🖨️' :
//                    equipment.category === 'Machining' ? '🔧' :
//                    equipment.category === 'Testing' ? '📊' : '⚙️'}
//                 </span>
//               </div>
//             )}
            
//             <div className={`status-badge status-${getStatusColor(equipment.status)}`}>
//               <span className="status-icon">{getStatusIcon(equipment.status)}</span>
//               <span className="status-text">{equipment.status || 'Available'}</span>
//             </div>
//           </div>

//           <div className="equipment-info">
//             <div className="equipment-header">
//               <h1>{equipment.name}</h1>
//               {equipment.category && (
//                 <span className="equipment-category">{equipment.category}</span>
//               )}
//             </div>

//             <div className="equipment-meta">
//               {equipment.manufacturer && (
//                 <div className="meta-item">
//                   <span className="meta-icon">🏭</span>
//                   <span><strong>Manufacturer:</strong> {equipment.manufacturer}</span>
//                 </div>
//               )}
              
//               {equipment.model && (
//                 <div className="meta-item">
//                   <span className="meta-icon">🔢</span>
//                   <span><strong>Model:</strong> {equipment.model}</span>
//                 </div>
//               )}
              
//               {equipment.location && (
//                 <div className="meta-item">
//                   <span className="meta-icon">📍</span>
//                   <span><strong>Location:</strong> {equipment.location}</span>
//                 </div>
//               )}
//             </div>

//             {equipment.description && (
//               <div className="equipment-description">
//                 <h3>Description</h3>
//                 <p>{equipment.description}</p>
//               </div>
//             )}

//             {equipment.requiresApproval && (
//               <div className="approval-notice">
//                 <span className="approval-icon">⚠️</span>
//                 <span>This equipment requires manager approval for booking</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Technical Specifications */}
//         {equipment.specifications && Object.keys(equipment.specifications).length > 0 && (
//           <div className="specifications-section">
//             <h3>Technical Specifications</h3>
//             <div className="specifications-grid">
//               {Object.entries(equipment.specifications).map(([key, value]) => (
//                 <div key={key} className="specification-item">
//                   <span className="spec-key">{key}:</span>
//                   <span className="spec-value">{value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Operating Instructions */}
//         {equipment.operatingInstructions && (
//           <div className="instructions-section">
//             <h3>Operating Instructions</h3>
//             <div className="instructions-content">
//               <p>{equipment.operatingInstructions}</p>
//             </div>
//           </div>
//         )}

//         {/* Safety Notes */}
//         {equipment.safetyNotes && (
//           <div className="safety-section">
//             <h3>Safety Information</h3>
//             <div className="safety-content">
//               <p>{equipment.safetyNotes}</p>
//             </div>
//           </div>
//         )}

//         {/* Booking Actions */}
//         <div className="booking-actions">
//           <div className="action-buttons">
//             <Button
//               onClick={addToCart}
//               className="primary"
//               disabled={!isItemAvailable()}
//             >
//               {!isItemAvailable() ? 'Unavailable' : 'Add to Cart'}
//             </Button>
            
//             <Button
//               onClick={() => setShowBookingForm(!showBookingForm)}
//               className="secondary"
//               disabled={!isItemAvailable()}
//             >
//               Quick Book
//             </Button>
//           </div>

//           {showBookingForm && isItemAvailable() && (
//             <div className="quick-booking-form">
//               <h3>Quick Booking</h3>
              
//               <div className="booking-form-content">
//                 <div className="quantity-control">
//                   <label>Quantity:</label>
//                   <div className="quantity-input">
//                     <button 
//                       onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                       disabled={quantity <= 1}
//                     >
//                       -
//                     </button>
//                     <span>{quantity}</span>
//                     <button 
//                       onClick={() => setQuantity(quantity + 1)}
//                       disabled={quantity >= 5}
//                     >
//                       +
//                     </button>
//                   </div>
//                 </div>

//                 <div className="date-selection">
//                   <label>Select Date:</label>
//                   <Calendar
//                     selectedDate={selectedDate}
//                     onDateSelect={setSelectedDate}
//                     minDate={new Date()}
//                   />
//                 </div>

//                 <div className="time-selection">
//                   <label>Select Time:</label>
//                   <select
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                     className="time-select"
//                   >
//                     <option value="">Choose time slot</option>
//                     {timeSlots.map(time => (
//                       <option key={time} value={time}>
//                         {time}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="notes-section">
//                   <label>Notes (Optional):</label>
//                   <textarea
//                     value={bookingNotes}
//                     onChange={(e) => setBookingNotes(e.target.value)}
//                     placeholder="Any special requirements or notes..."
//                     rows="3"
//                   />
//                 </div>

//                 <div className="booking-form-actions">
//                   <Button
//                     onClick={() => setShowBookingForm(false)}
//                     className="secondary"
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     onClick={quickBook}
//                     className="primary"
//                     disabled={!selectedDate || !selectedTime}
//                   >
//                     Submit Booking
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Recent Booking History */}
//         {bookingHistory.length > 0 && (
//           <div className="booking-history">
//             <h3>Recent Bookings</h3>
//             <div className="booking-list">
//               {bookingHistory.slice(0, 5).map((booking, index) => (
//                 <div key={index} className="booking-item">
//                   <div className="booking-user">{booking.userName || 'User'}</div>
//                   <div className="booking-date">{formatDate(booking.bookingDate)}</div>
//                   <div className={`booking-status status-${getStatusColor(booking.status)}`}>
//                     {booking.status}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ItemsShowPage;