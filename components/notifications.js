// components/Notification.js
import React from 'react';

const Notification = ({ notification }) => {
  return (
    <div className="notification-item">
      <p>{notification.message}</p>
      {/* Add any other notification details you want to display */}
    </div>
  );
};
export default Notification;
