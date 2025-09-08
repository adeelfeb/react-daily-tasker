import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventsContext';
import CalendarComponent from '../components/common/Calendar';
import EventForm from '../components/forms/EventForm';
import Layout from '../components/layout/Layout';
import './CalendarPage.css';

const CalendarPage = () => {
  const { isAdmin } = useAuth();
  const { deleteEvent } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

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

  return (
    <Layout>
      <div className="calendar-page">
        <div className="container">
          <div className="page-header">
            <h1>Event Calendar</h1>
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

          <CalendarComponent
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
