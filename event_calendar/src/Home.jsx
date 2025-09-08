import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiBell } from 'react-icons/fi';
import SimpleMonthCalendar from './components/common/SimpleMonthCalendar';
import { eventsAPI } from './services/api';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleGetStarted = () => {
    // Scroll to calendar section
    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const loadPublic = async () => {
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
        setError('Unable to load events right now.');
      } finally {
        setLoading(false);
      }
    };
    loadPublic();
  }, []);

  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>Event Calendar</h1>
            </div>
            <nav className="header-nav">
              <button className="btn btn-outline" onClick={() => navigate('/events')}>
                View Events
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h2 className="hero-title">Plan. Publish. Manage.</h2>
            <p className="hero-subtitle">
              A focused calendar for teams. Admins publish events. Everyone can browse what's coming.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary hero-cta" onClick={handleGetStarted}>
                Get Started
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/events')}>
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-block">
              <div className="feature-icon">
                <FiCalendar size={28} />
              </div>
              <h3>Admin publishing</h3>
              <p>Admins create and manage events in a streamlined dashboard.
              </p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                <FiCheckCircle size={28} />
              </div>
              <h3>Public calendar</h3>
              <p>Everyone can view upcoming events without logging in.
              </p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                <FiBell size={28} />
              </div>
              <h3>Clean & minimal</h3>
              <p>A sleek dark UI focused on clarity and readability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Public Calendar on Home */}
      <section ref={calendarRef} className="features">
        <div className="container">
          <h2 className="hero-title" style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Upcoming Events</h2>
          <p className="hero-subtitle" style={{ marginBottom: '1.25rem' }}>
            Explore scheduled public events.
          </p>
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="calendar-container">
              <SimpleMonthCalendar events={events} />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <nav className="footer-nav">
              <a href="/">Home</a>
              <a href="/privacy">Privacy & Terms</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
