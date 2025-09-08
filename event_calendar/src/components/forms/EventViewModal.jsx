import { useState, useEffect } from 'react';
import { EVENT_TYPES } from '../../constants';
import './EventViewModal.css';

const EventViewModal = ({ event, onClose }) => {
  const [formattedEvent, setFormattedEvent] = useState(null);

  useEffect(() => {
    if (event) {
      const formatted = {
        title: event.title || '',
        description: event.description || '',
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
        type: event.type || EVENT_TYPES.MEETING,
        location: event.location || '',
        allDay: Boolean(event.allDay),
      };
      setFormattedEvent(formatted);
    }
  }, [event]);

  const formatDateTime = (date) => {
    if (!date) return '';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
          <div className="event-view-field">
            <label>Title</label>
            <div className="event-view-value">{formattedEvent.title}</div>
          </div>

          <div className="event-view-row">
            <div className="event-view-field">
              <label>Start {formattedEvent.allDay ? 'Date' : 'Date & Time'}</label>
              <div className="event-view-value">
                {formattedEvent.allDay 
                  ? formatDate(formattedEvent.start)
                  : formatDateTime(formattedEvent.start)
                }
              </div>
            </div>

            <div className="event-view-field">
              <label>End {formattedEvent.allDay ? 'Date' : 'Date & Time'}</label>
              <div className="event-view-value">
                {formattedEvent.allDay 
                  ? formatDate(formattedEvent.end)
                  : formatDateTime(formattedEvent.end)
                }
              </div>
            </div>
          </div>

          <div className="event-view-row">
            <div className="event-view-field">
              <label>Event Type</label>
              <div className="event-view-value">
                <span className={`event-type-badge event-type-${formattedEvent.type}`}>
                  {getEventTypeLabel(formattedEvent.type)}
                </span>
              </div>
            </div>

            <div className="event-view-field">
              <label>Location</label>
              <div className="event-view-value">
                {formattedEvent.location || 'No location specified'}
              </div>
            </div>
          </div>

          {formattedEvent.description && (
            <div className="event-view-field">
              <label>Description</label>
              <div className="event-view-value event-description">
                {formattedEvent.description}
              </div>
            </div>
          )}

          <div className="event-view-field">
            <label>Duration</label>
            <div className="event-view-value">
              {formattedEvent.allDay ? (
                'All Day Event'
              ) : (
                `${formatTime(formattedEvent.start)} - ${formatTime(formattedEvent.end)}`
              )}
            </div>
          </div>
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
