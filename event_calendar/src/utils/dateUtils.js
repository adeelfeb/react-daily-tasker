import moment from 'moment';

// Format date for display
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  return moment(date).format(format);
};

// Format time for display
export const formatTime = (date, format = 'h:mm A') => {
  return moment(date).format(format);
};

// Format date and time
export const formatDateTime = (date, format = 'MMM DD, YYYY h:mm A') => {
  return moment(date).format(format);
};

// Check if date is today
export const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

// Check if date is in the past
export const isPast = (date) => {
  return moment(date).isBefore(moment(), 'day');
};

// Get start of day
export const getStartOfDay = (date) => {
  return moment(date).startOf('day').toDate();
};

// Get end of day
export const getEndOfDay = (date) => {
  return moment(date).endOf('day').toDate();
};

// Add days to date
export const addDays = (date, days) => {
  return moment(date).add(days, 'days').toDate();
};

// Get date range for calendar view
export const getDateRange = (view, date) => {
  const start = moment(date).startOf(view);
  const end = moment(date).endOf(view);
  return { start: start.toDate(), end: end.toDate() };
};
