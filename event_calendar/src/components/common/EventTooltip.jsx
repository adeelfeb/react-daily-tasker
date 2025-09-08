import { useState, useRef, useEffect } from 'react';

const EventTooltip = ({ event, children, position = 'top', extraActionLabel, onExtraAction }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const showTooltip = (e) => {
    if (!event) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    
    if (tooltip) {
      const tooltipRect = tooltip.getBoundingClientRect();
      let top = 0;
      let left = 0;

      if (position === 'top') {
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
      } else if (position === 'bottom') {
        top = rect.bottom + 8;
        left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
      } else if (position === 'left') {
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.left - tooltipRect.width - 8;
      } else if (position === 'right') {
        top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
        left = rect.right + 8;
      }

      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 8) left = 8;
      if (left + tooltipRect.width > viewportWidth - 8) {
        left = viewportWidth - tooltipRect.width - 8;
      }
      if (top < 8) top = 8;
      if (top + tooltipRect.height > viewportHeight - 8) {
        top = viewportHeight - tooltipRect.height - 8;
      }

      setTooltipPosition({ top, left });
    }
    
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      
      {isVisible && event && (
        <div
          ref={tooltipRef}
          className="event-tooltip"
          style={{
            position: 'fixed',
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            zIndex: 1000,
          }}
        >
          <div className="event-tooltip-content">
            <div className="event-tooltip-header">
              <h4>{event.title}</h4>
              <span className="event-tooltip-type">{event.type || 'Event'}</span>
            </div>
            
            <div className="event-tooltip-details">
              <div className="event-tooltip-time">
                <strong>When:</strong> {formatDate(event.start)} at {formatTime(event.start)}
                {event.end && event.end !== event.start && (
                  <span> - {formatTime(event.end)}</span>
                )}
              </div>
              
              {event.location && (
                <div className="event-tooltip-location">
                  <strong>Where:</strong> {event.location}
                </div>
              )}
              
              {event.description && (
                <div className="event-tooltip-description">
                  <strong>Description:</strong> {event.description}
                </div>
              )}
            </div>

            {extraActionLabel && typeof onExtraAction === 'function' && (
              <div style={{ marginTop: 8, textAlign: 'right' }}>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onExtraAction(event);
                  }}
                  style={{ pointerEvents: 'auto' }}
                >
                  {extraActionLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventTooltip;
