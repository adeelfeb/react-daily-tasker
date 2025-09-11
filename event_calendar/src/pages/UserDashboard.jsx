import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import SimpleCalendar from '../components/common/SimpleCalendar';
import errorHandler from '../utils/errorHandler';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents();
      const apiEvents = response?.data?.data || response?.data?.events || [];
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
      const errorMessage = errorHandler.handleApiError(err, 'fetching events');
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your calendar...</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="dashboard-title">
              <h1>My Calendar</h1>
              <p>Welcome back, {user?.name || 'User'}!</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchEvents}>
                Try Again
              </button>
            </div>
          )}
          
          <div className="calendar-container">
            <SimpleCalendar 
              events={events}
              onEventClick={(event) => console.log('Event clicked:', event)}
              onDateClick={(date) => console.log('Date clicked:', date)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
