// import sendRequest from './send-request';

// const BASE_URL = '/api/users';

// export function signUp(userData) {
//   return sendRequest(BASE_URL, 'POST', userData);
// }

// export function login(credentials) {
//   return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
// }

// utilities/users-api.js
import sendRequest from './send-request';

const BASE_URL = '/api/users';

// Basic authentication
export function signUp(userData) {
  return sendRequest(`${BASE_URL}/`, 'POST', userData);
}

export function login(credentials) {
  return sendRequest(`${BASE_URL}/login`, 'POST', credentials);
}

// Additional essential functions you might need
export function checkToken() {
  return sendRequest(`${BASE_URL}/check-token`, 'GET');
}

export function getProfile() {
  return sendRequest(`${BASE_URL}/profile`, 'GET');
}

export function updateProfile(userData) {
  return sendRequest(`${BASE_URL}/profile`, 'PUT', userData);
}

export function changePassword(currentPassword, newPassword) {
  return sendRequest(`${BASE_URL}/change-password`, 'POST', {
    currentPassword,
    newPassword
  });
}

// Password reset
export function requestPasswordReset(email) {
  return sendRequest(`${BASE_URL}/request-password-reset`, 'POST', { email });
}

export function confirmPasswordReset(token, newPassword) {
  return sendRequest(`${BASE_URL}/confirm-password-reset`, 'POST', {
    token,
    newPassword
  });
}

export function updateAdminAvailability(availability) {
  return sendRequest('/api/admin', 'PATCH', { adminAvailability: availability });
}

export function getAdminProfile() {
  return sendRequest('/api/admin/profile', 'GET');
}