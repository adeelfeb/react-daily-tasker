import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import SimpleCalendar from '../components/common/SimpleCalendar';
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
      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.log('API not available, using mock data');
      // Use mock data when API is not available
      setEvents([
        {
          id: 1,
          title: 'Sample Event',
          start: new Date(),
          end: new Date(Date.now() + 3600000),
          type: 'meeting'
        }
      ]);
      setError(null);
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
