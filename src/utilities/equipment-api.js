//Zahraa
// src/utilities/equipment-api.js

const BASE_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Equipment/Items API
export const getItems = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/items${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getItemById = async (itemId) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const createItem = async (itemData) => {
  const response = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData)
  });
  
  return handleResponse(response);
};

export const updateItem = async (itemId, itemData) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData)
  });
  
  return handleResponse(response);
};

export const deleteItem = async (itemId) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getItemAvailability = async (itemId, year, month) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}/availability?year=${year}&month=${month}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

// Cart API (could be localStorage-based or server-based)
export const getCartItems = async () => {
  // For now, using localStorage. In production, this could be server-based
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    // Fetch full item details for cart items
    const itemPromises = cart.map(cartItem => getItemById(cartItem.itemId || cartItem._id));
    const items = await Promise.all(itemPromises);
    return items;
  } catch (error) {
    console.error('Failed to get cart items:', error);
    return [];
  }
};

export const addToCart = async (itemId) => {
  try {
    // Check if item is already in cart
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => (item.itemId || item._id) === itemId);
    
    if (existingItem) {
      throw new Error('Item is already in your cart');
    }
    
    // Add item to cart
    cart.push({ itemId, addedAt: new Date().toISOString() });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    return { success: true, message: 'Item added to cart' };
  } catch (error) {
    console.error('Failed to add to cart:', error);
    throw error;
  }
};

export const removeFromCart = async (itemId) => {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => (item.itemId || item._id) !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    return { success: true, message: 'Item removed from cart' };
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    localStorage.removeItem('cart');
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  
  const result = await handleResponse(response);
  
  // Clear cart after successful order creation
  await clearCart();
  
  return result;
};

export const getUserOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/orders${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getOrderById = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const updateOrderStatus = async (orderId, status, notes = '') => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes })
  });
  
  return handleResponse(response);
};

export const cancelOrder = async (orderId) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const approveOrder = async (orderId, notes = '') => {
  return updateOrderStatus(orderId, 'Approved', notes);
};

export const rejectOrder = async (orderId, reason) => {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/reject`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reason })
  });
  
  return handleResponse(response);
};

// Admin/Manager specific APIs
export const getAllOrders = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/admin/orders${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getPendingOrders = async () => {
  return getAllOrders({ status: 'Pending' });
};

export const getOrdersByStatus = async (status) => {
  return getAllOrders({ status });
};

// Analytics API
export const getAnalyticsData = async (dateRange = {}) => {
  const queryParams = new URLSearchParams(dateRange).toString();
  const url = `${BASE_URL}/analytics${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getEquipmentUsageStats = async (itemId, dateRange = {}) => {
  const queryParams = new URLSearchParams({ itemId, ...dateRange }).toString();
  const url = `${BASE_URL}/analytics/equipment/${itemId}${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getPopularEquipment = async (limit = 10) => {
  const response = await fetch(`${BASE_URL}/analytics/popular-equipment?limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const getBookingTrends = async (period = '30days') => {
  const response = await fetch(`${BASE_URL}/analytics/booking-trends?period=${period}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

// Maintenance API
export const createMaintenanceLog = async (itemId, logData) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}/maintenance`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(logData)
  });
  
  return handleResponse(response);
};

export const getMaintenanceLogs = async (itemId) => {
  const response = await fetch(`${BASE_URL}/items/${itemId}/maintenance`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const updateMaintenanceStatus = async (itemId, status, notes = '') => {
  const response = await fetch(`${BASE_URL}/items/${itemId}/maintenance/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status, notes })
  });
  
  return handleResponse(response);
};

// User Management API (Admin only)
export const getUsers = async (filters = {}) => {
  const queryParams = new URLSearchParams(filters).toString();
  const url = `${BASE_URL}/admin/users${queryParams ? `?${queryParams}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const updateUserRole = async (userId, role) => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ role })
  });
  
  return handleResponse(response);
};

export const getUserBookingHistory = async (userId) => {
  const response = await fetch(`${BASE_URL}/admin/users/${userId}/bookings`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

// Notifications API
export const getNotifications = async () => {
  const response = await fetch(`${BASE_URL}/notifications`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const markNotificationAsRead = async (notificationId) => {
  const response = await fetch(`${BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const markAllNotificationsAsRead = async () => {
  const response = await fetch(`${BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

// Search API
export const searchEquipment = async (query, filters = {}) => {
  const searchParams = new URLSearchParams({ 
    q: query, 
    ...filters 
  }).toString();
  
  const response = await fetch(`${BASE_URL}/search/equipment?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

// Categories API
export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  return handleResponse(response);
};

export const createCategory = async (categoryData) => {
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(categoryData)
  });
  
  return handleResponse(response);
};

// Reports API
export const generateReport = async (reportType, filters = {}) => {
  const response = await fetch(`${BASE_URL}/reports/${reportType}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(filters)
  });
  
  return handleResponse(response);
};

export const downloadReport = async (reportId) => {
  const response = await fetch(`${BASE_URL}/reports/${reportId}/download`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  
  if (!response.ok) {
    throw new Error('Failed to download report');
  }
  
  return response.blob();
};

// File upload API
export const uploadItemImage = async (itemId, imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch(`${BASE_URL}/items/${itemId}/image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  
  return handleResponse(response);
};

export const uploadManual = async (itemId, manualFile) => {
  const formData = new FormData();
  formData.append('manual', manualFile);
  
  const response = await fetch(`${BASE_URL}/items/${itemId}/manual`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  
  return handleResponse(response);
};

// Utility functions for date/time handling
export const formatDateForAPI = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  return date;
};

export const formatTimeForAPI = (time) => {
  if (typeof time === 'string' && time.length === 5) {
    return `${time}:00`;
  }
  return time;
};

export const calculateBookingDuration = (startDate, startTime, endDate, endTime) => {
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  return (end - start) / (1000 * 60 * 60); // Return hours
};

// Validation utilities
export const validateBookingTime = (startDate, startTime, endDate, endTime) => {
  const now = new Date();
  const start = new Date(`${startDate}T${startTime}`);
  const end = new Date(`${endDate}T${endTime}`);
  
  if (start <= now) {
    throw new Error('Booking must be in the future');
  }
  
  if (end <= start) {
    throw new Error('End time must be after start time');
  }
  
  const duration = (end - start) / (1000 * 60 * 60);
  if (duration > 24) {
    throw new Error('Booking cannot exceed 24 hours');
  }
  
  return true;
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Error handling utilities
export const getErrorMessage = (error) => {
  if (error.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Cache utilities (for better performance)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const clearCache = (keyPrefix = '') => {
  if (keyPrefix) {
    for (const key of cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
};