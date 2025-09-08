import React from 'react';

const CalendarToolbar = (toolbar) => {
  const goToBack = () => toolbar.onNavigate('PREV');
  const goToNext = () => toolbar.onNavigate('NEXT');
  const goToToday = () => toolbar.onNavigate('TODAY');

  const setView = (view) => () => toolbar.onView(view);

  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button type="button" onClick={goToBack}>Back</button>
        <button type="button" onClick={goToToday}>Today</button>
        <button type="button" onClick={goToNext}>Next</button>
      </span>
      <span className="rbc-toolbar-label">{toolbar.label}</span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className={toolbar.view === 'month' ? 'rbc-active' : ''}
          onClick={setView('month')}
        >Month</button>
        <button
          type="button"
          className={toolbar.view === 'week' ? 'rbc-active' : ''}
          onClick={setView('week')}
        >Week</button>
        <button
          type="button"
          className={toolbar.view === 'day' ? 'rbc-active' : ''}
          onClick={setView('day')}
        >Day</button>
        <button
          type="button"
          className={toolbar.view === 'agenda' ? 'rbc-active' : ''}
          onClick={setView('agenda')}
        >Agenda</button>
      </span>
    </div>
  );
};

export default CalendarToolbar;


