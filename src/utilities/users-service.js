import * as usersAPI  from './users-api';

export async function signUp(userData) {
  // The backend now returns { token: "...", user: {...} }
  const response = await usersAPI.signUp(userData);
  // Persist the token to localStorage
  localStorage.setItem('token', response.token);
  // Return the user object directly
  return response.user;
}

export async function login(credentials) {
  // The backend now returns { token: "...", user: {...} }
  const response = await usersAPI.login(credentials);
  // Persist the token to localStorage
  localStorage.setItem('token', response.token);
  // Return the user object directly
  return response.user;
}

export function getToken() {
  const token = localStorage.getItem('token');
  // getItem will return null if no key
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // A JWT's expiration is expressed in seconds, not miliseconds
    if (payload.exp < Date.now() / 1000) {
      // Token has expired
      localStorage.removeItem('token');
      return null;
    }
    return token;
  } catch (error) {
    // Token is malformed or invalid
    console.log('Invalid token, removing from localStorage');
    localStorage.removeItem('token');
    return null;
  }
}

export function getUser() {
  const token = getToken();
  if (!token) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1])).user;
  } catch (error) {
    // Token is malformed, remove it
    console.log('Invalid token format, removing from localStorage');
    localStorage.removeItem('token');
    return null;
  }
}

export function logOut() {
  localStorage.removeItem('token');
}