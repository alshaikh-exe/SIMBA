// import { getToken } from './users-service';

// export default async function sendRequest(url, method = 'GET', payload = null) {
//   const options = { method };
//   if (payload) {
//     options.headers = { 'Content-Type': 'application/json' };
//     options.body = JSON.stringify(payload);
//   }
//   const token = getToken();
//   if (token) {
//     options.headers = options.headers || {};
//     options.headers.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(url, options);
//   if (res.ok) return res.json();
//   const text = await res.text();
//   throw new Error(`Bad Request: ${text}`);
// }

// utilities/send-request.js

// utilities/send-request.js
import { getToken, removeToken } from './users-service';

export default async function sendRequest(url, method = 'GET', payload = null, customHeaders = {}) {
  const options = { 
    method,
    headers: {
      'Content-Type': 'application/json',
      ...customHeaders
    }
  };
  
  // Add payload for non-GET requests
  if (payload) {
    if (payload instanceof FormData) {
      // For file uploads, don't set Content-Type header
      delete options.headers['Content-Type'];
      options.body = payload;
    } else {
      options.body = JSON.stringify(payload);
    }
  }
  
  // Add authorization header if token exists
  const token = getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, options);
    
    // Handle no content response
    if (res.status === 204) {
      return null;
    }

    if (res.ok) {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return res.json();
      }
      return res.text();
    }

    // Handle different error cases
    const text = await res.text();
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch {
      errorData = { message: text };
    }

    // Handle authentication errors
    if (res.status === 401) {
      removeToken();
      // Optionally redirect to login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw new Error(errorData.message || 'Authentication required');
    } else if (res.status === 403) {
      throw new Error(errorData.message || 'Access denied');
    } else if (res.status === 404) {
      throw new Error(errorData.message || 'Resource not found');
    } else if (res.status === 422) {
      throw new Error(errorData.message || 'Validation failed');
    } else if (res.status >= 500) {
      throw new Error(errorData.message || 'Server error');
    } else {
      throw new Error(errorData.message || `Bad Request: ${text}`);
    }

  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
}