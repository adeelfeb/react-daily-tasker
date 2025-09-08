import { STORAGE_KEYS } from '../constants';

// Check if user has valid session
export const hasValidSession = () => {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  
  if (!token || !userData) {
    return false;
  }
  
  try {
    const user = JSON.parse(userData);
    return user && user.id && user.email;
  } catch (error) {
    // Clear invalid data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return false;
  }
};

// Get user data from session
export const getSessionUser = () => {
  const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  
  if (!userData) {
    return null;
  }
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    return null;
  }
};

// Clear session data
export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
};

// Check if user is admin
export const isUserAdmin = () => {
  const user = getSessionUser();
  return user && user.role === 'admin';
};

// Check if user is regular user
export const isUserRegular = () => {
  const user = getSessionUser();
  return user && user.role === 'user';
};
