import React, { useMemo, useState } from 'react';
import './SimpleMonthCalendar.css';

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day + 6) % 7; // make Monday=0
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const isSameMonth = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const formatMonthYear = (date) => date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
const formatDayShort = (date) => date.toLocaleDateString(undefined, { weekday: 'short' });

const SimpleMonthCalendar = ({
  events = [],
  onEventClick,
  onDateClick,
  initialDate = new Date(),
}) => {
  const [current, setCurrent] = useState(initialDate);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const gridStart = startOfWeek(monthStart);
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => addDays(gridStart, i)), [gridStart]);

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const ev of events) {
      const start = new Date(ev.start);
      const key = new Date(start.getFullYear(), start.getMonth(), start.getDate()).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return map;
  }, [events]);

  const goPrev = () => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  const goNext = () => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  const goToday = () => setCurrent(new Date());

  return (
    <div className="smc">
      <div className="smc-toolbar">
        <div className="smc-left">
          <button className="smc-btn" onClick={goPrev}>Back</button>
          <button className="smc-btn" onClick={goToday}>Today</button>
          <button className="smc-btn" onClick={goNext}>Next</button>
        </div>
        <div className="smc-label">{formatMonthYear(current)}</div>
        <div className="smc-right" />
      </div>

      <div className="smc-weekdays">
        {Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date()), i)).map((d) => (
          <div key={d.toDateString()} className="smc-weekday">{formatDayShort(d)}</div>
        ))}
      </div>

      <div className="smc-grid">
        {days.map((day) => {
          const key = new Date(day.getFullYear(), day.getMonth(), day.getDate()).toDateString();
          const dayEvents = eventsByDay.get(key) || [];
          const isOutside = !isSameMonth(day, current);
          const isToday = isSameDay(day, new Date());
          return (
            <div key={key} className={`smc-cell${isOutside ? ' smc-outside' : ''}${isToday ? ' smc-today' : ''}`} onClick={() => onDateClick && onDateClick(day)}>
              <div className="smc-date">{day.getDate()}</div>
              <div className="smc-events">
                {dayEvents.slice(0, 3).map((ev) => (
                  <div key={(ev.id || ev._id) + ''} className={`smc-event smc-${ev.type || 'event'}`} title={ev.title} onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(ev); }}>
                    {ev.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="smc-more">+{dayEvents.length - 3} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleMonthCalendar;


