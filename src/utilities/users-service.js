// import * as usersAPI  from './users-api';

// export async function signUp(userData) {
//   // The backend now returns { token: "...", user: {...} }
//   const response = await usersAPI.signUp(userData);
//   // Persist the token to localStorage
//   localStorage.setItem('token', response.token);
//   // Return the user object directly
//   return response.user;
// }

// export async function login(credentials) {
//   // The backend now returns { token: "...", user: {...} }
//   const response = await usersAPI.login(credentials);
//   // Persist the token to localStorage
//   localStorage.setItem('token', response.token);
//   // Return the user object directly
//   return response.user;
// }

// export function getToken() {
//   const token = localStorage.getItem('token');
//   // getItem will return null if no key
//   if (!token) return null;
  
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     // A JWT's expiration is expressed in seconds, not miliseconds
//     if (payload.exp < Date.now() / 1000) {
//       // Token has expired
//       localStorage.removeItem('token');
//       return null;
//     }
//     return token;
//   } catch (error) {
//     // Token is malformed or invalid
//     console.log('Invalid token, removing from localStorage');
//     localStorage.removeItem('token');
//     return null;
//   }
// }

// export function getUser() {
//   const token = getToken();
//   if (!token) return null;
  
//   try {
//     return JSON.parse(atob(token.split('.')[1])).user;
//   } catch (error) {
//     // Token is malformed, remove it
//     console.log('Invalid token format, removing from localStorage');
//     localStorage.removeItem('token');
//     return null;
//   }
// }

// export function logOut() {
//   localStorage.removeItem('token');
// }

// utilities/users-service.js
import * as usersAPI from './users-api';

const TOKEN_KEY = 'token';

// Token management functions
export function getToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // A JWT's expiration is expressed in seconds, not milliseconds
    if (payload.exp < Date.now() / 1000) {
      // Token has expired
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch (error) {
    // Token is malformed or invalid
    console.log('Invalid token, removing from localStorage');
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1])).user;
  } catch (error) {
    // Token is malformed, remove it
    console.log('Invalid token format, removing from localStorage');
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

export function isAuthenticated() {
  return !!getToken();
}

export function logOut() {
  localStorage.removeItem(TOKEN_KEY);
  // Optionally redirect to login page
  // window.location.href = '/login';
}

// Authentication functions
export async function signUp(userData) {
  try {
    // The backend returns { token: "...", user: {...} }
    const response = await usersAPI.signUp(userData);
    // Persist the token to localStorage
    setToken(response.token);
    // Return the user object directly
    return response.user;
  } catch (error) {
    // Log error for debugging
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function login(credentials) {
  try {
    // The backend returns { token: "...", user: {...} }
    const response = await usersAPI.login(credentials);
    // Persist the token to localStorage
    setToken(response.token);
    // Return the user object directly
    return response.user;
  } catch (error) {
    // Log error for debugging
    console.error('Login error:', error);
    throw error;
  }
}

// Profile management functions
export async function getProfile() {
  try {
    return await usersAPI.getProfile();
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

export async function updateProfile(userData) {
  try {
    const response = await usersAPI.updateProfile(userData);
    return response;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
}

export async function changePassword(currentPassword, newPassword) {
  try {
    const response = await usersAPI.changePassword(currentPassword, newPassword);
    return response;
  } catch (error) {
    console.error('Change password error:', error);
    throw error;
  }
}

// Password reset functions
export async function requestPasswordReset(email) {
  try {
    const response = await usersAPI.requestPasswordReset(email);
    return response;
  } catch (error) {
    console.error('Request password reset error:', error);
    throw error;
  }
}

export async function confirmPasswordReset(token, newPassword) {
  try {
    const response = await usersAPI.confirmPasswordReset(token, newPassword);
    return response;
  } catch (error) {
    console.error('Confirm password reset error:', error);
    throw error;
  }
}

// Token validation
export async function checkToken() {
  try {
    return await usersAPI.checkToken();
  } catch (error) {
    // If token check fails, remove invalid token
    removeToken();
    throw error;
  }
}