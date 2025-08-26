// utilities/requests-api.js
import sendRequest from './send-request';
import { getToken } from './users-service';

const BASE_URL = '/api/requests';

// Get all student requests (for admin view)
export async function getStudentRequests() {
  return sendRequest(BASE_URL, 'GET');
}

// Get requests for a specific student
export async function getMyRequests() {
  return sendRequest(`${BASE_URL}/my-requests`, 'GET');
}

// Create a new equipment request
export async function createRequest(requestData) {
  return sendRequest(BASE_URL, 'POST', requestData);
}

// Update request status (admin only)
export async function updateRequestStatus(requestId, status, adminNotes = '') {
  return sendRequest(`${BASE_URL}/${requestId}/status`, 'PATCH', {
    status,
    adminNotes
  });
}

// Get a specific request by ID
export async function getRequestById(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'GET');
}

// Update a request (student can update before approval)
export async function updateRequest(requestId, requestData) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'PUT', requestData);
}

// Delete a request (student can delete before approval)
export async function deleteRequest(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'DELETE');
}

// Cancel a request (changes status to cancelled)
export async function cancelRequest(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}/cancel`, 'PATCH');
}

// Get request statistics (admin only)
export async function getRequestStats() {
  return sendRequest(`${BASE_URL}/stats`, 'GET');
}

// Get requests by equipment ID
export async function getRequestsByEquipment(equipmentId) {
  return sendRequest(`${BASE_URL}/equipment/${equipmentId}`, 'GET');
}

// Get requests by date range
export async function getRequestsByDateRange(startDate, endDate) {
  return sendRequest(`${BASE_URL}/date-range?start=${startDate}&end=${endDate}`, 'GET');
}

// Approve multiple requests at once (admin only)
export async function approveMultipleRequests(requestIds) {
  return sendRequest(`${BASE_URL}/bulk-approve`, 'POST', {
    requestIds
  });
}

// Reject multiple requests at once (admin only)
export async function rejectMultipleRequests(requestIds, reason = '') {
  return sendRequest(`${BASE_URL}/bulk-reject`, 'POST', {
    requestIds,
    reason
  });
}

// Get available time slots for equipment
export async function getAvailableTimeSlots(equipmentId, date) {
  return sendRequest(`${BASE_URL}/availability/${equipmentId}?date=${date}`, 'GET');
}

// Check if equipment is available for specific time slot
export async function checkAvailability(equipmentId, startDate, endDate, startTime, endTime) {
  return sendRequest(`${BASE_URL}/check-availability`, 'POST', {
    equipmentId,
    startDate,
    endDate,
    startTime,
    endTime
  });
}

// Get request history for a student
export async function getRequestHistory(studentId) {
  return sendRequest(`${BASE_URL}/history/${studentId}`, 'GET');
}

// Send notification about request status change
export async function notifyStatusChange(requestId, message) {
  return sendRequest(`${BASE_URL}/${requestId}/notify`, 'POST', {
    message
  });
}

// Get overdue requests (admin only)
export async function getOverdueRequests() {
  return sendRequest(`${BASE_URL}/overdue`, 'GET');
}

// Mark request as completed (can be done by admin or student)
export async function markRequestCompleted(requestId, completionNotes = '') {
  return sendRequest(`${BASE_URL}/${requestId}/complete`, 'PATCH', {
    completionNotes
  });
}

// Get requests needing attention (pending approvals, overdue returns, etc.)
export async function getRequestsNeedingAttention() {
  return sendRequest(`${BASE_URL}/needs-attention`, 'GET');
}

// Export request data to CSV (admin only)
export async function exportRequestsToCSV(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/export/csv${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to export requests');
  }
  
  return response.blob();
}

// Get request analytics data (admin only)
export async function getRequestAnalytics(timeRange = '30d') {
  return sendRequest(`${BASE_URL}/analytics?range=${timeRange}`, 'GET');
}