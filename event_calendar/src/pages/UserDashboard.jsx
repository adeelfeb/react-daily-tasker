import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import SimpleCalendar from '../components/common/SimpleCalendar';
import { UK_CITIES } from '../constants';
import errorHandler from '../utils/errorHandler';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on selected cities
  useEffect(() => {
    if (selectedCities.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.city && selectedCities.includes(event.city)
      );
      setFilteredEvents(filtered);
    }
  }, [events, selectedCities]);

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
        city: e.city,
        allDay: Boolean(e.allDay),
        imageUrl: e.imageUrl,
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

  const handleCityFilterChange = (city) => {
    setSelectedCities(prev => {
      if (prev.includes(city)) {
        return prev.filter(c => c !== city);
      } else {
        return [...prev, city];
      }
    });
  };

  const clearCityFilters = () => {
    setSelectedCities([]);
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
              <div className="city-filter">
                <label htmlFor="city-filter-select">Filter by City:</label>
                <select
                  id="city-filter-select"
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleCityFilterChange(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="">Add city filter</option>
                  {UK_CITIES.filter(city => !selectedCities.includes(city)).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {selectedCities.length > 0 && (
                  <div className="selected-cities">
                    {selectedCities.map(city => (
                      <span key={city} className="city-tag">
                        {city}
                        <button 
                          type="button" 
                          onClick={() => handleCityFilterChange(city)}
                          className="remove-city"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button 
                      type="button" 
                      onClick={clearCityFilters}
                      className="clear-filters"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
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
              events={filteredEvents}
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
