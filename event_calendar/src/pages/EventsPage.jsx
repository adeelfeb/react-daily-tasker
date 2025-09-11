import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { STORAGE_KEYS, UK_CITIES } from '../constants';
import SimpleMonthCalendar from '../components/common/SimpleMonthCalendar';
import './CalendarPage.css';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);

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
          city: e.city,
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
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Add Event
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            <SimpleMonthCalendar events={filteredEvents} />
            <p style={{ color: 'var(--color-text-muted)', marginTop: '1.25rem' }}>
              Browse upcoming public events.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;


