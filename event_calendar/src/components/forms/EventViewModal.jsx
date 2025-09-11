import { useState, useEffect } from 'react';
import { EVENT_TYPES } from '../../constants';
import './EventViewModal.css';

const EventViewModal = ({ event, onClose }) => {
  const [formattedEvent, setFormattedEvent] = useState(null);

  useEffect(() => {
    if (event) {
      const formatted = {
        ...event,
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
      };
      setFormattedEvent(formatted);
    }
  }, [event]);

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeLabel = (type) => {
    const typeMap = {
      [EVENT_TYPES.MEETING]: 'Meeting',
      [EVENT_TYPES.TASK]: 'Task',
      [EVENT_TYPES.REMINDER]: 'Reminder',
      [EVENT_TYPES.OTHER]: 'Other',
    };
    return typeMap[type] || 'Event';
  };

  if (!formattedEvent) return null;

  return (
    <div className="event-view-modal-overlay" onClick={onClose}>
      <div className="event-view-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="event-view-modal-header">
          <h2>Event Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="event-view-modal-content">
          <div className="event-detail-item">
            <label>Title:</label>
            <div className="event-detail-value">{formattedEvent.title}</div>
          </div>

          <div className="event-detail-item">
            <label>Type:</label>
            <div className="event-detail-value">
              <span className={`event-type-badge event-type-${formattedEvent.type}`}>
                {getEventTypeLabel(formattedEvent.type)}
              </span>
            </div>
          </div>

          <div className="event-detail-item">
            <label>Date & Time:</label>
            <div className="event-detail-value">
              {formattedEvent.allDay ? (
                'All Day Event'
              ) : (
                `${formatTime(formattedEvent.start)} - ${formatTime(formattedEvent.end)}`
              )}
            </div>
          </div>

          {formattedEvent.city && (
            <div className="event-detail-item">
              <label>City:</label>
              <div className="event-detail-value">🏙️ {formattedEvent.city}</div>
            </div>
          )}

          {formattedEvent.location && (
            <div className="event-detail-item">
              <label>Location:</label>
              <div className="event-detail-value">📍 {formattedEvent.location}</div>
            </div>
          )}

          {formattedEvent.description && (
            <div className="event-detail-item">
              <label>Description:</label>
              <div className="event-detail-value">{formattedEvent.description}</div>
            </div>
          )}
        </div>

        <div className="event-view-modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventViewModal;
