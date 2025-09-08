import { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import SimpleMonthCalendar from '../components/common/SimpleMonthCalendar';
import './CalendarPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await eventsAPI.getPublicEvents();
        const apiEvents = res?.data?.data || [];
        const normalized = apiEvents.map((e) => ({
          id: e.id || e._id,
          title: e.title,
          description: e.description,
          start: e.start ? new Date(e.start) : null,
          end: e.end ? new Date(e.end) : null,
          type: e.type,
          location: e.location,
          allDay: Boolean(e.allDay),
        }));
        setEvents(normalized);
        setError(null);
      } catch (err) {
        setError('Unable to load events at the moment.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>Community Events</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
        Browse upcoming public events.
      </p>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <SimpleMonthCalendar events={events} />
      )}
    </div>
  );
};

export default EventsPage;


