import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import CalendarComponent from '../components/common/Calendar';
import EventForm from '../components/forms/EventForm';
import Layout from '../components/layout/Layout';
import { UK_CITIES } from '../constants';
import './CalendarPage.css';

const CalendarPage = () => {
  const { isAdmin } = useAuth();
  const { deleteEvent, events, fetchEvents } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleSelectSlot = (slotInfo) => {
    if (isAdmin()) {
      setSelectedSlot(slotInfo);
      setSelectedEvent(null);
      setShowEventForm(true);
    }
  };

  const handleEventDrop = async (event) => {
    if (isAdmin()) {
      // Handle event drop - update event time
      console.log('Event dropped:', event);
      // You can implement drag and drop functionality here
    }
  };

  const handleEventResize = async (event) => {
    if (isAdmin()) {
      // Handle event resize - update event duration
      console.log('Event resized:', event);
      // You can implement resize functionality here
    }
  };

  const handleEventFormSuccess = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setSelectedSlot(null);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventId);
      setShowEventForm(false);
      setSelectedEvent(null);
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

  return (
    <Layout>
      <div className="calendar-page">
        <div className="container">
          <div className="page-header">
            <h1>Event Calendar</h1>
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
              {isAdmin() && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedEvent(null);
                    setSelectedSlot(null);
                    setShowEventForm(true);
                  }}
                >
                  Add Event
                </button>
              )}
            </div>
          </div>

          <CalendarComponent
            events={filteredEvents}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
          />

          {showEventForm && (
            <EventForm
              event={selectedEvent}
              slotInfo={selectedSlot}
              onClose={handleEventFormClose}
              onSuccess={handleEventFormSuccess}
              onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent._id) : null}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
