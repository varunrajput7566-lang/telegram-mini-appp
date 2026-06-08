import React from 'react';
import '../../styles/modals.css';

export default function ServerDownModal() {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>⚠️ Server Maintenance</h2>
        <p>Our server is currently down for maintenance.</p>
        <p>Please try again in a few moments.</p>
        <button className="btn-primary" onClick={() => window.location.reload()}>
          Refresh
        </button>
      </div>
    </div>
  );
}
