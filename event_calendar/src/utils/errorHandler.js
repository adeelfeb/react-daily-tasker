// Global error handling utility
class ErrorHandler {
  constructor() {
    this.notifications = [];
    this.listeners = [];
  }

  // Add a notification
  addNotification(message, type = 'error', duration = 5000) {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      type, // 'error', 'success', 'warning', 'info'
      duration,
      timestamp: new Date()
    };

    this.notifications.push(notification);
    this.notifyListeners();

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }

    return id;
  }

  // Remove a notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Subscribe to notification changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // Handle API errors
  handleApiError(error, context = '') {
    console.error(`API Error${context ? ` in ${context}` : ''}:`, error);
    
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      if (data && data.message) {
        message = data.message;
      } else {
        switch (status) {
          case 400:
            message = 'Bad request. Please check your input.';
            break;
          case 401:
            message = 'You are not authorized to perform this action.';
            break;
          case 403:
            message = 'Access denied. You do not have permission.';
            break;
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 409:
            message = 'Conflict. The resource already exists.';
            break;
          case 422:
            message = 'Validation error. Please check your input.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = `Server error (${status}). Please try again later.`;
        }
      }
    } else if (error.request) {
      // Network error
      message = 'Network error. Please check your connection and try again.';
    } else {
      // Other error
      message = error.message || 'An unexpected error occurred';
    }

    this.addNotification(message, 'error');
    return message;
  }

  // Success notification
  success(message, duration = 3000) {
    return this.addNotification(message, 'success', duration);
  }

  // Error notification
  error(message, duration = 5000) {
    return this.addNotification(message, 'error', duration);
  }

  // Warning notification
  warning(message, duration = 4000) {
    return this.addNotification(message, 'warning', duration);
  }

  // Info notification
  info(message, duration = 3000) {
    return this.addNotification(message, 'info', duration);
  }
}

// Create singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;
