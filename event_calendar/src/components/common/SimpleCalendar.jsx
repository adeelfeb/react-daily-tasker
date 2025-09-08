import React from 'react';
import './SimpleCalendar.css';

const SimpleCalendar = ({ events = [], onEventClick, onDateClick }) => {
  return (
    <div className="simple-calendar">
      <h3>Calendar View</h3>
      <div className="calendar-placeholder">
        <p>Calendar will be displayed here</p>
        <p>Events: {events.length}</p>
        <button onClick={() => onDateClick && onDateClick(new Date())}>
          Test Date Click
        </button>
      </div>
    </div>
  );
};

export default SimpleCalendar;
