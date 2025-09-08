import React, { useState, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { CALENDAR_VIEWS } from '../../constants';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

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

const CalendarComponent = ({ 
  events = [], 
  onEventClick, 
  onDateClick, 
  onEventDrop, 
  onEventResize 
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

  return (
    <div className="calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={['month', 'week', 'day', 'agenda']}
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
        messages={{
          today: 'Today',
          previous: 'Back',
          next: 'Next',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          agenda: 'Agenda',
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
