// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://event-calendar-five.vercel.app/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Event Types
export const EVENT_TYPES = {
  MEETING: 'meeting',
  TASK: 'task',
  REMINDER: 'reminder',
  OTHER: 'other'
};

// Calendar Views
export const CALENDAR_VIEWS = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  AGENDA: 'agenda'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme'
};
