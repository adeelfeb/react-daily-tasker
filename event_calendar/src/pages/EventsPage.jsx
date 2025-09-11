import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { STORAGE_KEYS } from '../constants';
import SimpleMonthCalendar from '../components/common/SimpleMonthCalendar';
import './CalendarPage.css';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const res = token ? await eventsAPI.getEvents() : await eventsAPI.getPublicEvents();
        const apiEvents = res?.data?.data || res?.data?.events || [];
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
    <div className="events-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                Event Calendar
              </h1>
            </div>
            <nav className="header-nav">
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Add Event
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
    </div>
  );
};

export default EventsPage;


