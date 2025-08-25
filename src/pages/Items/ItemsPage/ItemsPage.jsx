//Zahraa
import React from "react";
import NavBar from "../../../components/Navbar/Navbar";
// import Items from "../../../components/Items/Items";

const ItemsPage = ({ user, setUser }) => {
  return (
    <main>
      <aside>
        <NavBar user={user} setUser={setUser} />
      </aside>
      <div>
        <h1>Items</h1>
        <Items user={user} />
      </div>
    </main>
  );
};

export default ItemsPage;
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './ItemsPage.scss';
// import Button from '../../../components/Button/Button';

// const ItemsPage = ({ user, cart, setCart }) => {
//   const [equipment, setEquipment] = useState([]);
//   const [filteredEquipment, setFilteredEquipment] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState('all');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEquipment();
//   }, []);

//   useEffect(() => {
//     filterEquipment();
//   }, [equipment, searchTerm, categoryFilter, statusFilter]);

//   const fetchEquipment = async () => {
//     try {
//       const response = await fetch('/api/items', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setEquipment(data);
        
//         // Extract unique categories
//         const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];
//         setCategories(uniqueCategories);
//       }
//     } catch (error) {
//       console.error('Error fetching equipment:', error);
//     }
//     setLoading(false);
//   };

//   const filterEquipment = () => {
//     let filtered = equipment;

//     // Search filter
//     if (searchTerm) {
//       filtered = filtered.filter(item =>
//         item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         item.category?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Category filter
//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter(item => item.category === categoryFilter);
//     }

//     // Status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(item => {
//         const status = item.status?.toLowerCase() || 'available';
//         return status === statusFilter;
//       });
//     }

//     setFilteredEquipment(filtered);
//   };

//   const addToCart = (item) => {
//     const existingItem = cart.find(cartItem => cartItem._id === item._id);
    
//     if (existingItem) {
//       // Update quantity
//       setCart(cart.map(cartItem => 
//         cartItem._id === item._id 
//           ? { ...cartItem, quantity: cartItem.quantity + 1 }
//           : cartItem
//       ));
//     } else {
//       // Add new item
//       setCart([...cart, { ...item, quantity: 1 }]);
//     }
    
//     // Show feedback
//     const button = document.querySelector(`[data-item-id="${item._id}"]`);
//     if (button) {
//       const originalText = button.textContent;
//       button.textContent = 'Added!';
//       button.style.background = '#4caf50';
//       setTimeout(() => {
//         button.textContent = originalText;
//         button.style.background = '';
//       }, 1000);
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

//   const isItemAvailable = (item) => {
//     const status = item.status?.toLowerCase() || 'available';
//     return status === 'available';
//   };

//   const getItemInCart = (itemId) => {
//     return cart.find(cartItem => cartItem._id === itemId);
//   };

//   if (loading) {
//     return (
//       <div className="items-page">
//         <div className="loading">Loading equipment...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="items-page">
//       <div className="page-header">
//         <div className="header-content">
//           <h1>Equipment Catalog</h1>
//           <p>Browse and book lab equipment</p>
//         </div>
        
//         {cart.length > 0 && (
//           <div className="cart-summary">
//             <Button 
//               onClick={() => navigate('/cart')} 
//               className="primary cart-btn"
//             >
//               Cart ({cart.length}) →
//             </Button>
//           </div>
//         )}
//       </div>

//       <div className="filters-section">
//         <div className="search-bar">
//           <input
//             type="text"
//             placeholder="Search equipment..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
        
//         <div className="filter-controls">
//           <select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Categories</option>
//             {categories.map(category => (
//               <option key={category} value={category}>
//                 {category}
//               </option>
//             ))}
//           </select>
          
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="filter-select"
//           >
//             <option value="all">All Status</option>
//             <option value="available">Available</option>
//             <option value="reserved">Reserved</option>
//             <option value="maintenance">Under Maintenance</option>
//             <option value="repair">In Repair</option>
//           </select>
//         </div>
        
//         <div className="results-info">
//           <p>Showing {filteredEquipment.length} of {equipment.length} items</p>
//         </div>
//       </div>

//       {filteredEquipment.length === 0 ? (
//         <div className="no-results">
//           <h2>No equipment found</h2>
//           <p>Try adjusting your search or filter criteria.</p>
//           <Button onClick={() => {
//             setSearchTerm('');
//             setCategoryFilter('all');
//             setStatusFilter('all');
//           }} className="secondary">
//             Clear Filters
//           </Button>
//         </div>
//       ) : (
//         <div className="equipment-grid">
//           {filteredEquipment.map(item => {
//             const cartItem = getItemInCart(item._id);
//             const isAvailable = isItemAvailable(item);
            
//             return (
//               <div key={item._id} className="equipment-card">
//                 <div className="equipment-image">
//                   {item.image ? (
//                     <img src={item.image} alt={item.name} />
//                   ) : (
//                     <div className="placeholder-image">
//                       <span className="equipment-icon">
//                         {item.category === 'Electronics' ? '🔌' :
//                          item.category === '3D Printing' ? '🖨️' :
//                          item.category === 'Machining' ? '🔧' :
//                          item.category === 'Testing' ? '📊' : '⚙️'}
//                       </span>
//                     </div>
//                   )}
                  
//                   <div className={`status-indicator status-${getStatusColor(item.status)}`}>
//                     <span className="status-icon">{getStatusIcon(item.status)}</span>
//                     <span className="status-text">{item.status || 'Available'}</span>
//                   </div>
                  
//                   {cartItem && (
//                     <div className="cart-indicator">
//                       <span className="cart-count">{cartItem.quantity}</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="equipment-info">
//                   <div className="equipment-header">
//                     <h3 className="equipment-name">{item.name}</h3>
//                     {item.category && (
//                       <span className="equipment-category">{item.category}</span>
//                     )}
//                   </div>
                  
//                   <p className="equipment-description">
//                     {item.description || 'No description available'}
//                   </p>
                  
//                   <div className="equipment-details">
//                     {item.location && (
//                       <div className="detail-item">
//                         <span className="detail-icon">📍</span>
//                         <span>{item.location}</span>
//                       </div>
//                     )}
                    
//                     {item.manufacturer && (
//                       <div className="detail-item">
//                         <span className="detail-icon">🏭</span>
//                         <span>{item.manufacturer}</span>
//                       </div>
//                     )}
                    
//                     {item.model && (
//                       <div className="detail-item">
//                         <span className="detail-icon">🔢</span>
//                         <span>Model: {item.model}</span>
//                       </div>
//                     )}
//                   </div>
                  
//                   {item.specifications && (
//                     <div className="equipment-specs">
//                       <h4>Key Specifications:</h4>
//                       <ul>
//                         {Object.entries(item.specifications).slice(0, 3).map(([key, value]) => (
//                           <li key={key}>
//                             <strong>{key}:</strong> {value}
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
                  
//                   {item.requiresApproval && (
//                     <div className="approval-notice">
//                       <span className="approval-icon">⚠️</span>
//                       <span>Requires manager approval</span>
//                     </div>
//                   )}
//                 </div>

//                 <div className="equipment-actions">
//                   <Button
//                     onClick={() => navigate(`/equipment/${item._id}`)}
//                     className="secondary view-btn"
//                   >
//                     View Details
//                   </Button>
                  
//                   <Button
//                     onClick={() => addToCart(item)}
//                     className={`primary add-btn ${!isAvailable ? 'disabled' : ''}`}
//                     disabled={!isAvailable}
//                     data-item-id={item._id}
//                   >
//                     {!isAvailable ? 'Unavailable' : 
//                      cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
//                   </Button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Quick Actions for Managers/Admins */}
//       {(user.role === 'manager' || user.role === 'admin') && (
//         <div className="admin-actions">
//           <Button
//             onClick={() => navigate('/equipment/add')}
//             className="success add-equipment-btn"
//           >
//             + Add New Equipment
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ItemsPage;