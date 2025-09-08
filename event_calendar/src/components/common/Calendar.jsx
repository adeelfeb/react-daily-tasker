import { useState, useCallback } from 'react';
import { Calendar as RBCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CALENDAR_VIEWS } from '../../constants';
import EventTooltip from './EventTooltip';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import './EventTooltip.css';

const localizer = momentLocalizer(moment);
const formats = {
  monthHeaderFormat: 'MMMM YYYY',
  dayHeaderFormat: 'dddd, MMMM DD, YYYY',
  dayFormat: 'ddd DD',
  agendaHeaderFormat: 'MMM DD, YYYY',
  agendaDateFormat: 'ddd, MMM DD, YYYY',
  agendaTimeFormat: 'HH:mm',
  timeGutterFormat: 'HH:mm',
  dayRangeHeaderFormat: ({ start, end }, culture, loc) =>
    `${loc.format(start, 'MMM DD, YYYY', culture)} — ${loc.format(end, 'MMM DD, YYYY', culture)}`,
};

// Custom event renderer for different views
const EventItem = ({ event, view, onCreateOverlapping }) => {
  const title = event?.title || '';
  
  // For month view, show compact version with tooltip
  if (view === 'month') {
    return (
      <EventTooltip event={event} position="top">
        <div className="calendar-event-item month-event">
          <span className="calendar-event-dot" />
          <span className="calendar-event-title">{title}</span>
        </div>
      </EventTooltip>
    );
  }
  
  // For week/day view, show full event with tooltip
  return (
    <EventTooltip 
      event={event} 
      position="top"
      extraActionLabel={typeof onCreateOverlapping === 'function' ? 'Create Overlapping' : undefined}
      onExtraAction={onCreateOverlapping}
    >
      <div className="calendar-event-item week-event">
        <span className="calendar-event-dot" />
        <span className="calendar-event-title">{title}</span>
      </div>
    </EventTooltip>
  );
};

const CalendarComponent = ({ 
  events = [], 
  onEventClick, 
  onDateClick, 
  onEventDrop, 
  onEventResize,
  onCreateOverlapping
}) => {
  const [view, setView] = useState(CALENDAR_VIEWS.MONTH);
  const [date, setDate] = useState(new Date());

  const handleSelectEvent = useCallback((event) => {
    if (onEventClick) {
      onEventClick(event);
    }
  }, [onEventClick]);

  const handleSelectSlot = useCallback((slotInfo) => {
    if (onDateClick) {
      onDateClick(slotInfo.start);
    }
  }, [onDateClick]);

  const handleEventDrop = useCallback((event) => {
    if (onEventDrop) {
      onEventDrop(event);
    }
  }, [onEventDrop]);

  const handleEventResize = useCallback((event) => {
    if (onEventResize) {
      onEventResize(event);
    }
  }, [onEventResize]);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    switch (event.type) {
      case 'meeting':
        backgroundColor = '#28a745';
        break;
      case 'task':
        backgroundColor = '#ffc107';
        break;
      case 'reminder':
        backgroundColor = '#dc3545';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Normalize events to ensure start/end are Date objects for reliable rendering
  const normalizedEvents = Array.isArray(events)
    ? events.map((evt) => ({
        ...evt,
        start: evt?.start instanceof Date ? evt.start : new Date(evt.start),
        end: evt?.end instanceof Date ? evt.end : new Date(evt.end),
      }))
    : [];

  return (
    <div className="calendar-container">
      <RBCalendar
        localizer={localizer}
        events={normalizedEvents}
        startAccessor="start"
        endAccessor="end"
        tooltipAccessor={() => ''}
        style={{ height: 600 }}
        views={['month', 'week', 'day']}
        view={view}
        onView={setView}
        date={date}
        onNavigate={setDate}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        eventPropGetter={eventStyleGetter}
        formats={formats}
        components={{
          event: (props) => (
            <EventItem 
              {...props} 
              view={view}
              onCreateOverlapping={onCreateOverlapping}
            />
          ),
        }}
        messages={{
          today: 'Today',
          previous: 'Back',
          next: 'Next',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          showMore: (total) => `+${total} more`,
        }}
        selectable
        resizable
        draggable
        popup
        showMultiDayTimes
        step={15}
        timeslots={2}
      />
      {(!events || events.length === 0) && (
        <div className="calendar-empty" style={{ marginTop: '1rem' }}>
          <p>No events yet.</p>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
