import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Yes", 
  cancelText = "Cancel",
  type = "warning" 
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="confirmation-modal-overlay" onClick={handleOverlayClick}>
      <div className="confirmation-modal-container">
        <div className={`confirmation-modal confirmation-modal-${type}`}>
          <div className="confirmation-modal-content">
            <div className="confirmation-modal-icon">
              {type === 'warning' && '⚠️'}
              {type === 'danger' && '🗑️'}
              {type === 'info' && 'ℹ️'}
            </div>
            <div className="confirmation-modal-message">
              <h3 className="confirmation-modal-title">{title}</h3>
              <p className="confirmation-modal-text">{message}</p>
            </div>
          </div>
          <div className="confirmation-modal-actions">
            <button 
              className="confirmation-modal-btn confirmation-modal-btn-cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button 
              className="confirmation-modal-btn confirmation-modal-btn-confirm"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
