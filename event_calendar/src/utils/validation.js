// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

// Event validation
export const validateEvent = (event) => {
  const errors = {};
  
  if (!event.title || event.title.trim() === '') {
    errors.title = 'Title is required';
  }
  
  if (!event.start) {
    errors.start = 'Start date is required';
  }
  
  if (!event.end) {
    errors.end = 'End date is required';
  }
  
  if (event.start && event.end && new Date(event.start) >= new Date(event.end)) {
    errors.end = 'End date must be after start date';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// User validation
export const validateUser = (user) => {
  const errors = {};
  
  if (!user.email || !isValidEmail(user.email)) {
    errors.email = 'Valid email is required';
  }
  
  if (!user.password || !isValidPassword(user.password)) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  if (!user.name || user.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
