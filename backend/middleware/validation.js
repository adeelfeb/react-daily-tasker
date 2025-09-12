// Simple validation middleware without express-validator

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = req.validationErrors || [];
  if (errors.length > 0) {
    console.log('Validation errors:', errors);
    console.log('Request body:', req.body);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = (req, res, next) => {
  const errors = [];
  const { name, email, password } = req.body;

  // Validate name
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  req.validationErrors = errors;
  next();
};

// User login validation
export const validateUserLogin = (req, res, next) => {
  const errors = [];
  const { email, password } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Validate password
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  req.validationErrors = errors;
  next();
};

// Event creation/update validation
export const validateEvent = (req, res, next) => {
  const errors = [];
  const { title, start, end, type, description, location, allDay } = req.body;

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Event title is required' });
  } else if (title.trim().length > 100) {
    errors.push({ field: 'title', message: 'Title cannot exceed 100 characters' });
  }

  // Validate start date
  if (!start) {
    errors.push({ field: 'start', message: 'Start date is required' });
  } else {
    const startDate = new Date(start);
    if (isNaN(startDate.getTime())) {
      errors.push({ field: 'start', message: 'Start date must be a valid date' });
    }
    // Removed past date validation to allow past events
  }

  // Validate end date
  if (!end) {
    errors.push({ field: 'end', message: 'End date is required' });
  } else {
    const endDate = new Date(end);
    if (isNaN(endDate.getTime())) {
      errors.push({ field: 'end', message: 'End date must be a valid date' });
    } else if (start && new Date(end) <= new Date(start)) {
      errors.push({ field: 'end', message: 'End date must be after start date' });
    }
  }

  // Validate type
  if (type && !['meeting', 'task', 'reminder', 'other'].includes(type)) {
    errors.push({ field: 'type', message: 'Invalid event type' });
  }

  // Validate description
  if (description && description.length > 500) {
    errors.push({ field: 'description', message: 'Description cannot exceed 500 characters' });
  }

  // Validate location
  if (location && location.length > 100) {
    errors.push({ field: 'location', message: 'Location cannot exceed 100 characters' });
  }

  // Validate allDay (handle string values from FormData)
  if (allDay !== undefined) {
    const allDayValue = allDay === 'true' || allDay === true;
    if (typeof allDay !== 'boolean' && allDay !== 'true' && allDay !== 'false') {
      errors.push({ field: 'allDay', message: 'All day must be a boolean value' });
    }
  }

  req.validationErrors = errors;
  next();
};

// Forgot password validation
export const validateForgotPassword = (req, res, next) => {
  const errors = [];
  const { email } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  req.validationErrors = errors;
  next();
};

// Reset password validation
export const validateResetPassword = (req, res, next) => {
  const errors = [];
  const { token, newPassword } = req.body;

  // Validate token
  if (!token) {
    errors.push({ field: 'token', message: 'Reset token is required' });
  }

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }

  req.validationErrors = errors;
  next();
};

// Change password validation
export const validateChangePassword = (req, res, next) => {
  const errors = [];
  const { currentPassword, newPassword } = req.body;

  // Validate current password
  if (!currentPassword) {
    errors.push({ field: 'currentPassword', message: 'Current password is required' });
  }

  // Validate new password
  if (!newPassword || newPassword.length < 6) {
    errors.push({ field: 'newPassword', message: 'New password must be at least 6 characters long' });
  }

  // Check if passwords are different
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push({ field: 'newPassword', message: 'New password must be different from current password' });
  }

  req.validationErrors = errors;
  next();
};