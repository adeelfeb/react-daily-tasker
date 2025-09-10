import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { eventsAPI } from '../services/api';
import Calendar from '../components/common/Calendar';
import SimpleMonthCalendar from '../components/common/SimpleMonthCalendar';
import EventForm from '../components/forms/EventForm';
import errorHandler from '../utils/errorHandler';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null); // non-null only when editing
  const [draftEvent, setDraftEvent] = useState(null); // used for creating with prefilled dates
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [calendarView, setCalendarView] = useState('month'); // 'month' | 'advanced'

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
      const errorMessage = errorHandler.handleApiError(err, 'fetching events');
      setError(errorMessage);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleEditEvent = (event) => {
    setDraftEvent(null);
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventsAPI.deleteEvent(eventId);
        await fetchEvents();
        errorHandler.success('Event deleted successfully');
      } catch (err) {
        errorHandler.handleApiError(err, 'deleting event');
      }
    }
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
    setDraftEvent(null);
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
          const msg = res?.data?.message || 'Event updated successfully';
          errorHandler.success(msg);
          return { message: msg };
        } else {
          await fetchEvents();
          const msg = 'Event updated successfully';
          errorHandler.success(msg);
          return { message: msg };
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
          const msg = res?.data?.message || 'Event created successfully';
          errorHandler.success(msg);
          return { message: msg };
        } else {
          await fetchEvents();
          const msg = 'Event created successfully';
          errorHandler.success(msg);
          return { message: msg };
        }
      }
    } catch (err) {
      // Surface error globally and let form handle field-level messages by rethrowing
      errorHandler.handleApiError(err, selectedEvent ? 'updating event' : 'creating event');
      throw err;
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
              <button 
                className="btn btn-outline" 
                onClick={() => window.open('/events', '_blank')}
              >
                View Events
              </button>
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
            <div className="toolbar-right">
              {viewMode === 'calendar' && (
                <div className="segmented">
                  <button 
                    className={calendarView === 'month' ? 'active' : ''}
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={calendarView === 'advanced' ? 'active' : ''}
                    onClick={() => setCalendarView('advanced')}
                  >
                    Advanced
                  </button>
                </div>
              )}
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
              {calendarView === 'month' ? (
                <SimpleMonthCalendar
                  events={events}
                  onEventClick={handleEditEvent}
                  onDateClick={(date) => {
                    // Prefill a 1-hour slot for new event creation
                    const start = new Date(date);
                    const end = new Date(date);
                    end.setHours(end.getHours() + 1);
                    setSelectedEvent(null);
                    setDraftEvent({ start, end });
                    setShowEventForm(true);
                  }}
                  enableInternalViewModal={false}
                />
              ) : (
                <Calendar 
                  events={events}
                  onEventClick={handleEditEvent}
                  onCreateOverlapping={(baseEvent) => {
                    const start = new Date(baseEvent.start);
                    const end = new Date(baseEvent.end || start.getTime() + 60 * 60 * 1000);
                    setSelectedEvent(null);
                    setDraftEvent({ start, end });
                    setShowEventForm(true);
                  }}
                  onDateClick={(date) => {
                    // Prefill a 1-hour slot for new event creation
                    const start = new Date(date);
                    const end = new Date(date);
                    end.setHours(end.getHours() + 1);
                    setSelectedEvent(null);
                    setDraftEvent({ start, end });
                    setShowEventForm(true);
                  }}
                />
              )}
            </div>
          ) : (
            <div className="events-list">
              <h2>All Events</h2>
              <div className="events-grid">
                {events.map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-header">
                      <h3>{event.title}</h3>
                    </div>
                    <div className="event-content">
                      <div className="event-details">
                        <span className="event-date">
                          {new Date(event.start).toLocaleDateString()} - {new Date(event.end).toLocaleDateString()}
                        </span>
                        <span className="event-type">{event.type}</span>
                      </div>
                      <p className="event-description">{event.description}</p>
                    </div>
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
                ))}
              </div>
              {/* Simple Upcoming table for next 7 days */}
              <div className="events-list" style={{ marginTop: '1.5rem' }}>
                <h2>Upcoming (Next 7 days)</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>Time</th>
                        <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>Title</th>
                        <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>Type</th>
                        <th style={{ textAlign: 'left', padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface-2)' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events
                        .filter(ev => {
                          const now = new Date();
                          const in7 = new Date();
                          in7.setDate(in7.getDate() + 7);
                          return new Date(ev.start) >= now && new Date(ev.start) <= in7;
                        })
                        .sort((a,b) => new Date(a.start) - new Date(b.start))
                        .map((ev) => (
                          <tr key={`up-${ev.id}`}>
                            <td style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                              {new Date(ev.start).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', whiteSpace: 'nowrap' }}>
                              {new Date(ev.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)' }}>
                              {ev.title || '\u00A0'}
                            </td>
                            <td style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)', textTransform: 'capitalize' }}>
                              {ev.type || '\u00A0'}
                            </td>
                            <td style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid var(--color-border)' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <button className="btn btn-sm btn-outline" onClick={() => handleEditEvent(ev)}>Edit</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(ev.id)}>Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      {events.filter(ev => {
                        const now = new Date();
                        const in7 = new Date();
                        in7.setDate(in7.getDate() + 7);
                        return new Date(ev.start) >= now && new Date(ev.start) <= in7;
                      }).length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ padding: '0.9rem 0.8rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                            No upcoming events.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Event Form Modal (centered overlay) */}
      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EventForm
              event={selectedEvent}
              initialDates={draftEvent}
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
