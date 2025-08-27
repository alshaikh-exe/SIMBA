// utilities/requests-api.js
import sendRequest from './send-request';
import { getToken } from './users-service';

const BASE_URL = '/api/orders';

// Get all student requests (for admin view)
// -> admin wants pending (requested) orders from everyone
export async function getStudentRequests() {
  return sendRequest(`${BASE_URL}?scope=requested`, 'GET');
}

// Get requests for the current student (their own orders)
export async function getMyRequests() {
  return sendRequest(`${BASE_URL}`, 'GET');
}

// Create a new equipment request
// NOTE: Your backend creates orders via POST /api/orders/submit
// If you use this from the StudentRequests form, make sure the payload matches
// { lines: [{ item: <ObjectId>, requestedDays: <1..50> }], notes?: string }
export async function createRequest(requestData) {
  return sendRequest(`${BASE_URL}/submit`, 'POST', requestData);
}

// --- Everything below left as-is; these endpoints don't exist on /api/orders
//     but I'm not changing them since you asked for necessary changes only.
//     If you plan to use them, we can map them to real /api/orders endpoints.
export async function updateRequestStatus(requestId, status, adminNotes = '') {
  return sendRequest(`${BASE_URL}/${requestId}/status`, 'PATCH', {
    status,
    adminNotes
  });
}
export async function getRequestById(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'GET');
}
export async function updateRequest(requestId, requestData) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'PUT', requestData);
}
export async function deleteRequest(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}`, 'DELETE');
}
export async function cancelRequest(requestId) {
  return sendRequest(`${BASE_URL}/${requestId}/cancel`, 'PATCH');
}
export async function getRequestStats() {
  return sendRequest(`${BASE_URL}/stats`, 'GET');
}
export async function getRequestsByEquipment(equipmentId) {
  return sendRequest(`${BASE_URL}/equipment/${equipmentId}`, 'GET');
}
export async function getRequestsByDateRange(startDate, endDate) {
  return sendRequest(`${BASE_URL}/date-range?start=${startDate}&end=${endDate}`, 'GET');
}
export async function approveMultipleRequests(requestIds) {
  return sendRequest(`${BASE_URL}/bulk-approve`, 'POST', { requestIds });
}
export async function rejectMultipleRequests(requestIds, reason = '') {
  return sendRequest(`${BASE_URL}/bulk-reject`, 'POST', { requestIds, reason });
}
export async function getAvailableTimeSlots(equipmentId, date) {
  return sendRequest(`${BASE_URL}/availability/${equipmentId}?date=${date}`, 'GET');
}
export async function checkAvailability(equipmentId, startDate, endDate, startTime, endTime) {
  return sendRequest(`${BASE_URL}/check-availability`, 'POST', {
    equipmentId, startDate, endDate, startTime, endTime
  });
}
export async function getRequestHistory(studentId) {
  return sendRequest(`${BASE_URL}/history/${studentId}`, 'GET');
}
export async function notifyStatusChange(requestId, message) {
  return sendRequest(`${BASE_URL}/${requestId}/notify`, 'POST', { message });
}
export async function getOverdueRequests() {
  return sendRequest(`${BASE_URL}/overdue`, 'GET');
}
export async function markRequestCompleted(requestId, completionNotes = '') {
  return sendRequest(`${BASE_URL}/${requestId}/complete`, 'PATCH', { completionNotes });
}
export async function getRequestsNeedingAttention() {
  return sendRequest(`${BASE_URL}/needs-attention`, 'GET');
}
export async function exportRequestsToCSV(filters = {}) {
  const queryString = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/export/csv${queryString ? `?${queryString}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  if (!response.ok) throw new Error('Failed to export requests');
  return response.blob();
}
export async function getRequestAnalytics(timeRange = '30d') {
  return sendRequest(`${BASE_URL}/analytics?range=${timeRange}`, 'GET');
}

export async function approveOrder(orderId, body) {
  // body examples:
  // { reject: true }
  // { decisions: [{ item: "<itemId>", decision: "return", approvedDays: 3 }, ...] }
  return sendRequest(`/api/orders/${orderId}/approve`, 'PUT', body);
}