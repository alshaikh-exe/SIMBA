// contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, removeToken, setToken } from '../utilities/users-service';
import * as usersAPI from '../utilities/users-api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in when the app starts
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = getToken();
      if (token) {
        // Verify token is still valid and get user data
        const userData = await usersAPI.checkToken();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token is invalid or expired
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      console.error('Token validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const { user: userData, token } = await usersAPI.login(credentials);
      
      // Store the token
      setToken(token);
      
      // Update auth state
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const { user: newUser, token } = await usersAPI.signUp(userData);
      
      // Store the token
      setToken(token);
      
      // Update auth state
      setUser(newUser);
      setIsAuthenticated(true);
      
      return newUser;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Remove token from localStorage
    removeToken();
    
    // Clear auth state
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = await usersAPI.updateProfile(updatedData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await usersAPI.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Failed to change password:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      return await usersAPI.requestPasswordReset(email);
    } catch (error) {
      console.error('Failed to request password reset:', error);
      throw error;
    }
  };

  const confirmPasswordReset = async (token, newPassword) => {
    try {
      return await usersAPI.confirmPasswordReset(token, newPassword);
    } catch (error) {
      console.error('Failed to confirm password reset:', error);
      throw error;
    }
  };

  const refreshUserData = async () => {
    try {
      const userData = await usersAPI.getProfile();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // If refresh fails, the user might need to log in again
      logout();
      throw error;
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const isStaff = () => {
    return user?.role === 'staff';
  };

  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  const canAccessAdminPanel = () => {
    return isAdmin() || hasPermission('admin_access');
  };

  const canManageEquipment = () => {
    return isAdmin() || isStaff() || hasPermission('manage_equipment');
  };

  const canApproveRequests = () => {
    return isAdmin() || hasPermission('approve_requests');
  };

  const canViewAllRequests = () => {
    return isAdmin() || isStaff() || hasPermission('view_all_requests');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    return user.name || user.username || user.email;
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const contextValue = {
    // State
    user,
    loading,
    isAuthenticated,
    
    // Auth methods
    login,
    register,
    logout,
    updateUser,
    changePassword,
    resetPassword,
    confirmPasswordReset,
    refreshUserData,
    
    // Permission checks
    isAdmin,
    isStudent,
    isStaff,
    hasPermission,
    canAccessAdminPanel,
    canManageEquipment,
    canApproveRequests,
    canViewAllRequests,
    
    // Utility methods
    getUserDisplayName,
    getUserInitials,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;