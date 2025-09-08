import { useState, useEffect } from 'react';
import { EVENT_TYPES } from '../../constants';
import './DayEventsModal.css';

const DayEventsModal = ({ date, events = [], onClose, onEventClick }) => {
  const [formattedEvents, setFormattedEvents] = useState([]);

  useEffect(() => {
    if (events && events.length > 0) {
      const formatted = events.map(event => ({
        ...event,
        start: event.start ? new Date(event.start) : null,
        end: event.end ? new Date(event.end) : null,
      }));
      setFormattedEvents(formatted);
    }
  }, [events]);

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

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <div className="day-events-modal-overlay" onClick={onClose}>
      <div className="day-events-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="day-events-modal-header">
          <h2>Events for {formatDate(date)}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="day-events-modal-content">
          {formattedEvents.length === 0 ? (
            <div className="no-events">
              <p>No events scheduled for this day.</p>
            </div>
          ) : (
            <div className="events-list">
              {formattedEvents.map((event, index) => (
                <div 
                  key={event.id || event._id || index} 
                  className="day-event-item"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="event-time">
                    {event.allDay ? (
                      'All Day'
                    ) : (
                      `${formatTime(event.start)} - ${formatTime(event.end)}`
                    )}
                  </div>
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-meta">
                      <span className={`event-type-badge event-type-${event.type}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                      {event.location && (
                        <span className="event-location">📍 {event.location}</span>
                      )}
                    </div>
                    {event.description && (
                      <div className="event-description">{event.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="day-events-modal-actions">
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

export default DayEventsModal;
