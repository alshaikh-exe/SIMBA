//Zahraa
import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
// import Orders from "../../../components/Booking/Orders/Orders";

const OrdersPage = ({ user, setUser }) => {
  return (
    <main>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <div>
        <h1>Orders</h1>
        <Orders user={user} />
      </div>
    </main>
  );
};

export default OrdersPage;
// src/components/Booking/Orders/Orders.jsx
// import React, { useState, useEffect } from 'react';
// import { getUserOrders, cancelOrder, updateOrderStatus } from '../../../utilities/equipment-api';
// import Button from '../../Button/Button';
// import './Orders.scss';

// export default function Orders({ user }) {
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('newest');

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   useEffect(() => {
//     filterAndSortOrders();
//   }, [orders, statusFilter, sortBy]);

//   const loadOrders = async () => {
//     try {
//       setLoading(true);
//       const ordersData = await getUserOrders();
//       setOrders(ordersData);
//       setError('');
//     } catch (err) {
//       setError('Failed to load orders');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAndSortOrders = () => {
//     let filtered = orders;

//     // Filter by status
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(order => order.status === statusFilter);
//     }

//     // Sort orders
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case 'newest':
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         case 'oldest':
//           return new Date(a.createdAt) - new Date(b.createdAt);
//         case 'status':
//           return a.status.localeCompare(b.status);
//         case 'startDate':
//           const aStart = new Date(`${a.items[0]?.startDate}T${a.items[0]?.startTime}`);
//           const bStart = new Date(`${b.items[0]?.startDate}T${b.items[0]?.startTime}`);
//           return aStart - bStart;
//         default:
//           return 0;
//       }
//     });

//     setFilteredOrders(filtered);
//   };

//   const handleCancelOrder = async (orderId) => {
//     if (!window.confirm('Are you sure you want to cancel this booking?')) {
//       return;
//     }

//     try {
//       await cancelOrder(orderId);
//       setOrders(orders.map(order => 
//         order._id === orderId 
//           ? { ...order, status: 'Cancelled' }
//           : order
//       ));
//     } catch (err) {
//       setError('Failed to cancel order');
//       console.error(err);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Pending':
//         return 'status-pending';
//       case 'Approved':
//         return 'status-approved';
//       case 'Active':
//         return 'status-active';
//       case 'Completed':
//         return 'status-completed';
//       case 'Cancelled':
//         return 'status-cancelled';
//       case 'Rejected':
//         return 'status-rejected';
//       default:
//         return 'status-unknown';
//     }
//   };

//   const canCancelOrder = (order) => {
//     return ['Pending', 'Approved'].includes(order.status);
//   };

//   const formatDateTime = (date, time) => {
//     if (!date || !time) return 'Not specified';
//     const dateObj = new Date(`${date}T${time}`);
//     return dateObj.toLocaleString('en-US', {
//       weekday: 'short',
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const calculateOrderDuration = (order) => {
//     return order.items.reduce((total, item) => {
//       if (!item.startDate || !item.endDate || !item.startTime || !item.endTime) {
//         return total;
//       }
//       const start = new Date(`${item.startDate}T${item.startTime}`);
//       const end = new Date(`${item.endDate}T${item.endTime}`);
//       const hours = (end - start) / (1000 * 60 * 60);
//       return total + Math.max(0, hours);
//     }, 0);
//   };

//   if (loading) return <div className="orders-loading">Loading your bookings...</div>;

//   return (
//     <div className="orders-container">
//       <div className="orders-header">
//         <h2>My Bookings</h2>
//         <div className="orders-controls">
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Status</option>
//             <option value="Pending">Pending</option>
//             <option value="Approved">Approved</option>
//             <option value="Active">Active</option>
//             <option value="Completed">Completed</option>
//             <option value="Cancelled">Cancelled</option>
//             <option value="Rejected">Rejected</option>
//           </select>

//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className="filter-select"
//           >
//             <option value="newest">Newest First</option>
//             <option value="oldest">Oldest First</option>
//             <option value="status">By Status</option>
//             <option value="startDate">By Start Date</option>
//           </select>
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}

//       {filteredOrders.length === 0 ? (
//         <div className="no-orders">
//           <p>No bookings found.</p>
//           <p>Start by browsing the equipment catalog and adding items to your cart.</p>
//         </div>
//       ) : (
//         <div className="orders-list">
//           {filteredOrders.map(order => (
//             <div key={order._id} className="order-card">
//               <div className="order-header">
//                 <div className="order-info">
//                   <h3>Booking #{order._id.slice(-6)}</h3>
//                   <p className="order-date">
//                     Submitted: {new Date(order.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="order-status">
//                   <span className={`status-badge ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                 </div>
//               </div>

//               <div className="order-details">
//                 <div className="order-summary">
//                   <p><strong>Total Items:</strong> {order.totalItems}</p>
//                   <p><strong>Total Duration:</strong> {calculateOrderDuration(order).toFixed(1)} hours</p>
//                 </div>

//                 <div className="order-items">
//                   <h4>Equipment:</h4>
//                   {order.items.map((item, index) => (
//                     <div key={index} className="booking-item">
//                       <div className="item-info">
//                         <strong>{item.item?.name || 'Item not found'}</strong>
//                         <span className="item-category">
//                           {item.item?.category || 'Unknown category'}
//                         </span>
//                       </div>
//                       <div className="booking-time">
//                         <p><strong>From:</strong> {formatDateTime(item.startDate, item.startTime)}</p>
//                         <p><strong>To:</strong> {formatDateTime(item.endDate, item.endTime)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 {order.notes && (
//                   <div className="order-notes">
//                     <h4>Notes:</h4>
//                     <p>{order.notes}</p>
//                   </div>
//                 )}

//                 {order.rejectionReason && (
//                   <div className="rejection-reason">
//                     <h4>Rejection Reason:</h4>
//                     <p>{order.rejectionReason}</p>
//                   </div>
//                 )}
//               </div>

//               <div className="order-actions">
//                 {canCancelOrder(order) && (
//                   <Button
//                     variant="danger"
//                     onClick={() => handleCancelOrder(order._id)}
//                     size="small"
//                   >
//                     Cancel Booking
//                   </Button>
//                 )}
                
//                 <Button
//                   variant="secondary"
//                   onClick={() => window.open(`/orders/${order._id}`, '_blank')}
//                   size="small"
//                 >
//                   View Details
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }