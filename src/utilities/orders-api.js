// utilities/orders-api.js
import sendRequest from './send-request';
const BASE_URL = '/api/orders';

// Student cart
export const getCart = () => sendRequest(`${BASE_URL}/cart`, 'GET');
export const addToCart = (itemId) => sendRequest(`${BASE_URL}/cart/items`, 'POST', { itemId });
export const setCartQty = (itemId, qty) => sendRequest(`${BASE_URL}/cart/items/${itemId}`, 'PUT', { qty });

// Submit request
export const submitOrder = (lines, notes) =>
  sendRequest(`${BASE_URL}/submit`, 'POST', { lines, notes });

// Read order
export const getOrderById = (orderId) => sendRequest(`${BASE_URL}/${orderId}`, 'GET');

// Admin approve/reject
export const approveOrder = (orderId, decisions, reject = false) =>
  sendRequest(`${BASE_URL}/${orderId}/approve`, 'PUT', { decisions, reject });
