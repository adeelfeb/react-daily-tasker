import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import { usersAPI } from '../services/api';
import Layout from '../components/layout/Layout';
import EventForm from '../components/forms/EventForm';
import ConfirmationModal from '../components/common/ConfirmationModal';
import './AdminPage.css';

const AdminPage = () => {
  const { user } = useAuth();
  const { events, deleteEvent } = useEvents();
  const [users, setUsers] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('events');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      await deleteEvent(eventToDelete._id);
    }
    setEventToDelete(null);
  };

  const handleEventFormSuccess = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const handleEventFormClose = () => {
    setShowEventForm(false);
    setSelectedEvent(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="admin-page">
        <div className="container">
          <div className="page-header">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>

          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events ({events.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users ({users.length})
            </button>
          </div>

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="section-header">
                <h2>Manage Events</h2>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedEvent(null);
                    setShowEventForm(true);
                  }}
                >
                  Add New Event
                </button>
              </div>

              <div className="events-list">
                {events.length === 0 ? (
                  <div className="empty-state">
                    <p>No events found. Create your first event!</p>
                  </div>
                ) : (
                  <div className="events-grid">
                    {events.map((event) => (
                      <div key={event._id} className="event-card">
                        <div className="event-header">
                          <h3>{event.title}</h3>
                        </div>
                        <div className="event-content">
                          <div className="event-details">
                            <p><strong>Type:</strong> <span className={`event-type event-type-${event.type}`}>{event.type}</span></p>
                            <p><strong>Start:</strong> {formatDate(event.start)}</p>
                            <p><strong>End:</strong> {formatDate(event.end)}</p>
                            {event.location && (
                              <p><strong>Location:</strong> {event.location}</p>
                            )}
                          </div>
                          {event.description && (
                            <p className="event-description"><strong>Description:</strong> {event.description}</p>
                          )}
                        </div>
                        <div className="event-actions">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEditEvent(event)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteEvent(event)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h2>Manage Users</h2>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <p>Loading users...</p>
                </div>
              ) : (
                <div className="users-list">
                  {users.length === 0 ? (
                    <div className="empty-state">
                      <p>No users found.</p>
                    </div>
                  ) : (
                    <div className="users-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user) => (
                            <tr key={user._id}>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>
                                <span className={`role-badge ${user.role}`}>
                                  {user.role}
                                </span>
                              </td>
                              <td>{formatDate(user.createdAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {showEventForm && (
            <EventForm
              event={selectedEvent}
              onClose={handleEventFormClose}
              onSuccess={handleEventFormSuccess}
              onDelete={handleDeleteEvent}
            />
          )}

          {/* Delete Confirmation Modal */}
          <ConfirmationModal
            isOpen={showDeleteConfirm}
            onClose={() => {
              setShowDeleteConfirm(false);
              setEventToDelete(null);
            }}
            onConfirm={handleDeleteConfirm}
            title="Delete Event"
            message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
            confirmText="Yes"
            cancelText="Cancel"
            type="danger"
          />
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
