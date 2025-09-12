import { useState, useEffect } from 'react';
import errorHandler from '../../utils/errorHandler';
import { EVENT_TYPES, UK_CITIES } from '../../constants';
import ConfirmationModal from '../common/ConfirmationModal';
import './EventForm.css';

const EventForm = ({ event, initialDates, onSubmit, onClose, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: EVENT_TYPES.MEETING,
    location: '',
    city: '',
    allDay: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Helper function to format date for datetime-local input without timezone conversion
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Use local timezone to avoid date shifting
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (event) {
      // Editing existing event - preserve original dates
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start: formatDateForInput(event.start),
        end: formatDateForInput(event.end),
        type: event.type || EVENT_TYPES.MEETING,
        location: event.location || '',
        city: event.city || '',
        allDay: event.allDay || false,
      });
      // Set image preview if event has an image
      if (event.imageUrl) {
        setImagePreview(event.imageUrl);
      }
    } else if (initialDates) {
      // Creating a new event with prefilled dates
      setFormData(prev => ({
        ...prev,
        start: initialDates.start ? new Date(initialDates.start).toISOString().slice(0, 16) : prev.start,
        end: initialDates.end ? new Date(initialDates.end).toISOString().slice(0, 16) : prev.end,
      }));
    }
  }, [event, initialDates]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file'
        }));
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size must be less than 5MB'
        }));
        return;
      }
      
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      setErrors({ title: 'Title is required' });
      return;
    }
    
    if (!formData.start) {
      setErrors({ start: 'Start date is required' });
      return;
    }
    
    if (!formData.end) {
      setErrors({ end: 'End date is required' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Ensure end is after start client-side to avoid server validation error
      const clientStart = new Date(formData.start);
      const clientEnd = new Date(formData.end);
      if (Number.isNaN(clientStart.getTime())) {
        setErrors({ start: 'Start date must be a valid date' });
        return;
      }
      if (Number.isNaN(clientEnd.getTime())) {
        setErrors({ end: 'End date must be a valid date' });
        return;
      }
      if (clientEnd <= clientStart) {
        setErrors({ end: 'End date must be after start date' });
        return;
      }

      const eventData = {
        ...formData,
        start: clientStart.toISOString(),
        end: clientEnd.toISOString(),
      };

      const result = await onSubmit(eventData, imageFile);
      // Success notification is handled by the parent component
      // Ensure the notification is enqueued and rendered before closing
      await new Promise((resolve) => {
        if (typeof requestAnimationFrame === 'function') {
          requestAnimationFrame(() => resolve());
        } else {
          setTimeout(resolve, 0);
        }
      });
      onClose();
    } catch (error) {
      // Map server validation errors to specific fields when available
      const serverErrors = error?.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length > 0) {
        const fieldErrors = {};
        serverErrors.forEach((e) => {
          if (e.field && e.message) {
            fieldErrors[e.field] = e.message;
          }
        });
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
          return;
        }
      }
      const msg = error?.response?.data?.message || 'An unexpected error occurred';
      errorHandler.error(msg, 6000);
      setErrors({ submit: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      start: '',
      end: '',
      type: EVENT_TYPES.MEETING,
      location: '',
      city: '',
      allDay: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    onClose();
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (onDelete && event) {
      try {
        await onDelete(event.id || event._id);
        // Success notification is handled by the parent component
        onClose();
      } catch (error) {
        // Handle different types of errors with specific messages
        let errorMessage = 'Failed to delete event';
        
        if (error?.response?.status === 404) {
          errorMessage = 'Event not found. It may have already been deleted.';
        } else if (error?.response?.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error?.code === 'NETWORK_ERROR' || !error?.response) {
          errorMessage = 'Unable to connect to server. Please check your connection.';
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        
        errorHandler.error(errorMessage);
      }
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
        <button className="close-btn" onClick={handleClose} disabled={isSubmitting}>
          ×
        </button>
      </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start">Start Date & Time *</label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className={errors.start ? 'error' : ''}
              />
              {errors.start && <span className="error-message">{errors.start}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="end">End Date & Time *</label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className={errors.end ? 'error' : ''}
              />
              {errors.end && <span className="error-message">{errors.end}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Event Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value={EVENT_TYPES.MEETING}>Meeting</option>
                <option value={EVENT_TYPES.TASK}>Task</option>
                <option value={EVENT_TYPES.REMINDER}>Reminder</option>
                <option value={EVENT_TYPES.OTHER}>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Select a city</option>
                {UK_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Enter event description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Event Poster Image</label>
            <div className="image-upload-container">
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              <label htmlFor="image" className="image-upload-label">
                {imagePreview ? 'Change Image' : 'Choose Image'}
              </label>
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-btn"
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              )}
              {/* Show current image if editing and no new image selected */}
              {event && event.imageUrl && !imagePreview && (
                <div className="current-image-container">
                  <label className="current-image-label">Current Image:</label>
                  <div className="current-image-wrapper">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="current-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="current-image-error" style={{ display: 'none' }}>
                      <div className="image-placeholder">
                        <span>Image not available</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {errors.image && <span className="error-message">{errors.image}</span>}
            <small className="image-help-text">
              Supported formats: JPG, PNG, GIF, WebP. Max size: 5MB
            </small>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="allDay"
                checked={formData.allDay}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              All Day Event
            </label>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="btn btn-danger"
                disabled={isSubmitting}
              >
                Delete Event
              </button>
            )}
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
        
        <ConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Event"
          message={`Are you sure you want to delete "${event?.title}"? This action cannot be undone.`}
          confirmText="Yes"
          cancelText="Cancel"
          type="danger"
        />
    </div>
  );
};

export default EventForm;
