import { } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiCheckCircle, FiBell } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  

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
              {isAuthenticated ? (
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate(isAdmin() ? '/admin' : '/dashboard')}
                >
                  {isAdmin() ? 'Admin Dashboard' : 'My Dashboard'}
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                  Add Event
                </button>
              )}
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
              <button className="btn btn-outline" onClick={() => navigate('/events')}>
                Browse Events
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section (placed after calendar) */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-block">
              <div className="feature-icon">
                <FiCalendar size={28} />
              </div>
              <h3>Browse events</h3>
              <p>Navigate the calendar to see what’s coming up this month.
              </p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                <FiCheckCircle size={28} />
              </div>
              <h3>Check details</h3>
              <p>Open any event to view its title, time, and notes.
              </p>
            </div>
            
            <div className="feature-block">
              <div className="feature-icon">
                <FiBell size={28} />
              </div>
              <h3>Stay updated</h3>
              <p>Come back anytime to see newly added or updated events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Removed Home calendar section as requested */}

      {/* Footer removed: using global Layout footer */}
    </div>
  );
};

export default Home;
