import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import Calendar from '../components/common/Calendar';
import EventForm from '../components/forms/EventForm';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'

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
        createdBy: e.createdBy?._id || e.createdBy,
        attendees: e.attendees || [],
        isPublic: e.isPublic,
        status: e.status,
      }));
      setEvents(normalized);
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

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(eventId);
        await fetchEvents();
      } catch (err) {
        console.log('API not available, removing from local state');
        // Remove from local state when API is not available
        setEvents(prev => prev.filter(event => event.id !== eventId));
      }
    }
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleEventFormSubmit = async (eventData) => {
    try {
      if (selectedEvent) {
        const res = await eventsAPI.updateEvent(selectedEvent.id, eventData);
        const updated = res?.data?.data;
        if (updated) {
          setEvents((prev) => prev.map((ev) => (ev.id === selectedEvent.id ? {
            id: updated.id || updated._id,
            title: updated.title,
            description: updated.description,
            start: updated.start ? new Date(updated.start) : null,
            end: updated.end ? new Date(updated.end) : null,
            type: updated.type,
            location: updated.location,
            allDay: Boolean(updated.allDay),
            createdBy: updated.createdBy?._id || updated.createdBy,
            attendees: updated.attendees || [],
            isPublic: updated.isPublic,
            status: updated.status,
          } : ev)));
        } else {
          await fetchEvents();
        }
      } else {
        const res = await eventsAPI.createEvent(eventData);
        const created = res?.data?.data;
        if (created) {
          const normalized = {
            id: created.id || created._id,
            title: created.title,
            description: created.description,
            start: created.start ? new Date(created.start) : null,
            end: created.end ? new Date(created.end) : null,
            type: created.type,
            location: created.location,
            allDay: Boolean(created.allDay),
            createdBy: created.createdBy?._id || created.createdBy,
            attendees: created.attendees || [],
            isPublic: created.isPublic,
            status: created.status,
          };
          setEvents((prev) => [...prev, normalized]);
        } else {
          await fetchEvents();
        }
      }
      setShowEventForm(false);
      setSelectedEvent(null);
    } catch (err) {
      console.log('API not available, adding to local state');
      // Add to local state when API is not available
      const newEvent = {
        id: Date.now(),
        ...eventData,
        createdBy: user?.id
      };
      setEvents(prev => [...prev, newEvent]);
      setShowEventForm(false);
      setSelectedEvent(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="dashboard-title">
              <h1>Admin Dashboard</h1>
              <p>{user?.name ? user.name : 'Admin'}</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      {/* Compact toolbar below header */}
      <div className="dashboard-toolbar">
        <div className="container">
          <div className="toolbar-row">
            <div className="toolbar-left">
              <button 
                className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('calendar')}
              >
                Calendar
              </button>
              <button 
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setViewMode('list')}
              >
                All Events
              </button>
              <button className="btn btn-sm btn-primary" onClick={handleCreateEvent}>
                Create Event
              </button>
            </div>
          </div>
        </div>
      </div>

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
          
          {viewMode === 'calendar' ? (
            <div className="calendar-container">
              <Calendar 
                events={events}
                onEventClick={handleEditEvent}
                onDateClick={(date) => {
                  setSelectedEvent({ start: date, end: date });
                  setShowEventForm(true);
                }}
              />
            </div>
          ) : (
            <div className="events-list">
              <h2>All Events</h2>
              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                      <div className="event-actions">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEditEvent(event)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <span className="event-date">
                        {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                      </span>
                      <span className="event-type">{event.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EventForm
              event={selectedEvent}
              onSubmit={handleEventFormSubmit}
              onClose={handleEventFormClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
