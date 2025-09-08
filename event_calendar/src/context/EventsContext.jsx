import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { eventsAPI } from '../services/api';

const EventsContext = createContext();

const initialState = {
  events: [],
  isLoading: false,
  error: null,
  selectedEvent: null,
};

const eventsReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'FETCH_EVENTS_SUCCESS':
      return {
        ...state,
        events: action.payload,
        isLoading: false,
        error: null,
      };
    case 'FETCH_EVENTS_FAILURE':
      return {
        ...state,
        events: [],
        isLoading: false,
        error: action.payload,
      };
    case 'CREATE_EVENT_SUCCESS':
      return {
        ...state,
        events: [...state.events, action.payload],
        error: null,
      };
    case 'UPDATE_EVENT_SUCCESS':
      return {
        ...state,
        events: state.events.map(event =>
          event._id === action.payload._id ? action.payload : event
        ),
        error: null,
      };
    case 'DELETE_EVENT_SUCCESS':
      return {
        ...state,
        events: state.events.filter(event => event._id !== action.payload),
        error: null,
      };
    case 'SET_SELECTED_EVENT':
      return {
        ...state,
        selectedEvent: action.payload,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const EventsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventsReducer, initialState);

  const fetchEvents = async (params = {}) => {
    dispatch({ type: 'FETCH_EVENTS_START' });
    try {
      const response = await eventsAPI.getEvents(params);
      dispatch({
        type: 'FETCH_EVENTS_SUCCESS',
        payload: response.data,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch events';
      dispatch({
        type: 'FETCH_EVENTS_FAILURE',
        payload: errorMessage,
      });
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await eventsAPI.createEvent(eventData);
      dispatch({
        type: 'CREATE_EVENT_SUCCESS',
        payload: response.data,
      });
      return { success: true, event: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create event';
      dispatch({
        type: 'FETCH_EVENTS_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const response = await eventsAPI.updateEvent(id, eventData);
      dispatch({
        type: 'UPDATE_EVENT_SUCCESS',
        payload: response.data,
      });
      return { success: true, event: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update event';
      dispatch({
        type: 'FETCH_EVENTS_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventsAPI.deleteEvent(id);
      dispatch({
        type: 'DELETE_EVENT_SUCCESS',
        payload: id,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete event';
      dispatch({
        type: 'FETCH_EVENTS_FAILURE',
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  const setSelectedEvent = (event) => {
    dispatch({
      type: 'SET_SELECTED_EVENT',
      payload: event,
    });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Fetch events on mount (only if user is authenticated)
  useEffect(() => {
    // Don't fetch events on initial load to prevent blocking the app
    // Events will be fetched when user accesses dashboard
  }, []);

  const value = {
    ...state,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    setSelectedEvent,
    clearError,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};
