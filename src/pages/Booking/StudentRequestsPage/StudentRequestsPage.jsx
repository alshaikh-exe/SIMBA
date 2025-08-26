//Zahraa

import React from "react";
import StudentRequests from "../../../components/Booking/StudentRequests/StudentRequests";

const StudentRequestsPage = ({ user, setUser }) => {
  return (
    <main>

      <div>
        <h1>Student Requests</h1>
        <StudentRequests user={user} />
      </div>
    </main>
  );
};

export default StudentRequestsPage;


// import React from "react";
// import NavBar from "../../../components/Navbar/Navbar";
// import StudentRequests from "../../../components/Booking/StudentRequests/StudentRequests";

// const StudentRequestsPage = ({ user, setUser }) => {
//   return (
//     <main>
//       <aside>
//         <NavBar user={user} setUser={setUser} />
//       </aside>
//       <div>
//         <h1>Student Requests</h1>
//         <StudentRequests user={user} />
//       </div>
//     </main>
//   );
// };

// import React, { useState, useEffect } from 'react';
// import { getStudentRequests, updateRequestStatus } from '../../../utilities/requests-api';
// import { useAuth } from '../../../contexts/AuthContext';
// import './StudentRequestsPage.module.scss';

// export default function StudentRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     loadRequests();
//   }, []);

//   const loadRequests = async () => {
//     try {
//       setLoading(true);
//       const data = await getStudentRequests();
//       setRequests(data);
//     } catch (err) {
//       setError('Failed to load requests');
//       console.error('Error loading requests:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (requestId, newStatus) => {
//     try {
//       await updateRequestStatus(requestId, newStatus);
//       // Update local state
//       setRequests(prev => prev.map(req => 
//         req._id === requestId ? { ...req, status: newStatus } : req
//       ));
      
//       // Close modal if open
//       if (selectedRequest?._id === requestId) {
//         setSelectedRequest(null);
//       }
//     } catch (err) {
//       setError('Failed to update request status');
//       console.error('Error updating status:', err);
//     }
//   };

//   const filteredRequests = requests.filter(request => {
//     if (filter === 'all') return true;
//     return request.status === filter;
//   });

//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'pending': return 'status-badge pending';
//       case 'approved': return 'status-badge approved';
//       case 'rejected': return 'status-badge rejected';
//       case 'completed': return 'status-badge completed';
//       default: return 'status-badge';
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="student-requests">
//         <div className="loading">Loading requests...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="student-requests">
//       <div className="requests-header">
//         <h1>Equipment Requests</h1>
//         <div className="header-actions">
//           <button className="btn btn-primary" onClick={loadRequests}>
//             <i className="fas fa-sync"></i> Refresh
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="error-message">
//           {error}
//           <button onClick={() => setError('')} className="close-error">
//             &times;
//           </button>
//         </div>
//       )}

//       <div className="requests-filters">
//         <div className="filter-buttons">
//           <button 
//             className={filter === 'all' ? 'active' : ''}
//             onClick={() => setFilter('all')}
//           >
//             All ({requests.length})
//           </button>
//           <button 
//             className={filter === 'pending' ? 'active' : ''}
//             onClick={() => setFilter('pending')}
//           >
//             Pending ({requests.filter(r => r.status === 'pending').length})
//           </button>
//           <button 
//             className={filter === 'approved' ? 'active' : ''}
//             onClick={() => setFilter('approved')}
//           >
//             Approved ({requests.filter(r => r.status === 'approved').length})
//           </button>
//           <button 
//             className={filter === 'rejected' ? 'active' : ''}
//             onClick={() => setFilter('rejected')}
//           >
//             Rejected ({requests.filter(r => r.status === 'rejected').length})
//           </button>
//         </div>

//         <div className="search-box">
//           <input 
//             type="text" 
//             placeholder="Search requests..." 
//             className="search-input"
//           />
//           <i className="fas fa-search"></i>
//         </div>
//       </div>

//       <div className="requests-list">
//         {filteredRequests.length === 0 ? (
//           <div className="empty-state">
//             <i className="fas fa-clipboard-list"></i>
//             <h3>No requests found</h3>
//             <p>There are no {filter !== 'all' ? filter : ''} requests at the moment.</p>
//           </div>
//         ) : (
//           filteredRequests.map(request => (
//             <div key={request._id} className="request-card">
//               <div className="request-header">
//                 <div className="request-info">
//                   <h3 className="equipment-name">{request.equipmentId?.name || 'Unknown Equipment'}</h3>
//                   <span className={getStatusBadgeClass(request.status)}>
//                     {request.status}
//                   </span>
//                 </div>
//                 <div className="request-meta">
//                   <span className="request-date">
//                     Requested on {formatDate(request.createdAt)}
//                   </span>
//                   <span className="request-id">#{request._id.slice(-6)}</span>
//                 </div>
//               </div>

//               <div className="request-details">
//                 <div className="detail-row">
//                   <div className="detail-item">
//                     <label>Requested By:</label>
//                     <span>{request.studentId?.name || 'Unknown Student'}</span>
//                   </div>
//                   <div className="detail-item">
//                     <label>Student ID:</label>
//                     <span>{request.studentId?.studentId || 'N/A'}</span>
//                   </div>
//                 </div>

//                 <div className="detail-row">
//                   <div className="detail-item">
//                     <label>Requested Period:</label>
//                     <span>
//                       {formatDate(request.startDate)} - {formatDate(request.endDate)}
//                     </span>
//                   </div>
//                   <div className="detail-item">
//                     <label>Duration:</label>
//                     <span>{request.duration} hours</span>
//                   </div>
//                 </div>

//                 {request.purpose && (
//                   <div className="detail-item full-width">
//                     <label>Purpose:</label>
//                     <p className="purpose-text">{request.purpose}</p>
//                   </div>
//                 )}

//                 {request.notes && (
//                   <div className="detail-item full-width">
//                     <label>Additional Notes:</label>
//                     <p className="notes-text">{request.notes}</p>
//                   </div>
//                 )}
//               </div>

//               <div className="request-actions">
//                 <button 
//                   className="btn btn-outline"
//                   onClick={() => setSelectedRequest(request)}
//                 >
//                   <i className="fas fa-eye"></i> View Details
//                 </button>

//                 {user?.role === 'admin' && request.status === 'pending' && (
//                   <div className="admin-actions">
//                     <button 
//                       className="btn btn-success"
//                       onClick={() => handleStatusUpdate(request._id, 'approved')}
//                     >
//                       <i className="fas fa-check"></i> Approve
//                     </button>
//                     <button 
//                       className="btn btn-danger"
//                       onClick={() => handleStatusUpdate(request._id, 'rejected')}
//                     >
//                       <i className="fas fa-times"></i> Reject
//                     </button>
//                   </div>
//                 )}

//                 {request.status === 'approved' && (
//                   <button 
//                     className="btn btn-primary"
//                     onClick={() => handleStatusUpdate(request._id, 'completed')}
//                   >
//                     <i className="fas fa-check-circle"></i> Mark Complete
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Request Detail Modal */}
//       {selectedRequest && (
//         <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Request Details</h2>
//               <button 
//                 className="close-modal"
//                 onClick={() => setSelectedRequest(null)}
//               >
//                 &times;
//               </button>
//             </div>

//             <div className="modal-body">
//               <div className="detail-section">
//                 <h3>Equipment Information</h3>
//                 <p><strong>Name:</strong> {selectedRequest.equipmentId?.name}</p>
//                 <p><strong>Category:</strong> {selectedRequest.equipmentId?.category}</p>
//                 <p><strong>Model:</strong> {selectedRequest.equipmentId?.model || 'N/A'}</p>
//               </div>

//               <div className="detail-section">
//                 <h3>Student Information</h3>
//                 <p><strong>Name:</strong> {selectedRequest.studentId?.name}</p>
//                 <p><strong>Student ID:</strong> {selectedRequest.studentId?.studentId}</p>
//                 <p><strong>Email:</strong> {selectedRequest.studentId?.email}</p>
//                 <p><strong>Department:</strong> {selectedRequest.studentId?.department}</p>
//               </div>

//               <div className="detail-section">
//                 <h3>Request Details</h3>
//                 <p><strong>Status:</strong> <span className={getStatusBadgeClass(selectedRequest.status)}>{selectedRequest.status}</span></p>
//                 <p><strong>Start Date:</strong> {formatDate(selectedRequest.startDate)}</p>
//                 <p><strong>End Date:</strong> {formatDate(selectedRequest.endDate)}</p>
//                 <p><strong>Duration:</strong> {selectedRequest.duration} hours</p>
//                 {selectedRequest.purpose && <p><strong>Purpose:</strong> {selectedRequest.purpose}</p>}
//                 {selectedRequest.notes && <p><strong>Notes:</strong> {selectedRequest.notes}</p>}
//               </div>

//               {selectedRequest.adminNotes && (
//                 <div className="detail-section">
//                   <h3>Admin Notes</h3>
//                   <p>{selectedRequest.adminNotes}</p>
//                 </div>
//               )}
//             </div>

//             <div className="modal-actions">
//               {user?.role === 'admin' && selectedRequest.status === 'pending' && (
//                 <>
//                   <button 
//                     className="btn btn-success"
//                     onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')}
//                   >
//                     Approve Request
//                   </button>
//                   <button 
//                     className="btn btn-danger"
//                     onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
//                   >
//                     Reject Request
//                   </button>
//                 </>
//               )}
//               <button 
//                 className="btn btn-outline"
//                 onClick={() => setSelectedRequest(null)}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }