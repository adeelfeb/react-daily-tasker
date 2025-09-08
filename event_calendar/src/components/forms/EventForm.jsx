import React, { useState, useEffect } from 'react';
import { EVENT_TYPES } from '../../constants';
import './EventForm.css';

const EventForm = ({ event, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    type: EVENT_TYPES.MEETING,
    location: '',
    allDay: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        start: event.start ? new Date(event.start).toISOString().slice(0, 16) : '',
        end: event.end ? new Date(event.end).toISOString().slice(0, 16) : '',
        type: event.type || EVENT_TYPES.MEETING,
        location: event.location || '',
        allDay: event.allDay || false,
      });
    }
  }, [event]);

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
      const eventData = {
        ...formData,
        start: new Date(formData.start),
        end: new Date(formData.end),
      };

      await onSubmit(eventData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
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
      allDay: false,
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="event-form-container">
      <div className="event-form-header">
        <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
        <button className="close-btn" onClick={handleClose}>
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
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary"
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
    </div>
  );
};

export default EventForm;
