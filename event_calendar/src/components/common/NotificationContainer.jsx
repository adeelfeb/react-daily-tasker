import { useState, useEffect } from 'react';
import errorHandler from '../../utils/errorHandler';
import './NotificationContainer.css';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = errorHandler.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  const handleRemove = (id) => {
    errorHandler.removeNotification(id);
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification notification-${notification.type}`}
          onClick={() => handleRemove(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'error' && '⚠️'}
              {notification.type === 'success' && '✅'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'info' && 'ℹ️'}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(notification.id);
              }}
            >
              ×
            </button>
          </div>
          <div className="notification-progress">
            <div 
              className="notification-progress-bar"
              style={{
                animationDuration: `${notification.duration}ms`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
