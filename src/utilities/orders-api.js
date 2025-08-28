// utilities/orders-api.js
import sendRequest from './send-request';

const BASE_URL = '/api/orders';

/* ---------------- STUDENT CART ---------------- */
export const getCart = () => sendRequest(`${BASE_URL}/cart`, 'GET');
export const addToCart = (itemId) =>
  sendRequest(`${BASE_URL}/cart/items`, 'POST', { itemId });
export const setCartQty = (itemId, qty) =>
  sendRequest(`${BASE_URL}/cart/items/${itemId}`, 'PUT', { qty });

/* ---------------- ORDER SUBMISSION ---------------- */
export const submitOrder = (lines, notes) =>
  sendRequest(`${BASE_URL}/submit`, 'POST', { lines, notes });

/* ---------------- READ ORDERS ---------------- */
export const getOrderById = (orderId) =>
  sendRequest(`${BASE_URL}/${orderId}`, 'GET');
export const getOrders = () => sendRequest(BASE_URL, 'GET');

/* ---------------- ADMIN APPROVAL ---------------- */
export const approveOrder = (orderId, decisions, reject = false) =>
  sendRequest(`${BASE_URL}/${orderId}/approve`, 'PUT', { decisions, reject });
