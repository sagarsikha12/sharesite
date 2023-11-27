import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiConfig = {
  baseURL: `${apiUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  }
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('unapproved');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          return;
        }

        const response = await axios.get(`notifications?status=${filter}`, {
          ...apiConfig,
          headers: {
            ...apiConfig.headers,
            'Authorization': `Bearer ${token}`
          }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setErrorMessage('Error fetching notifications.');
      }
    };

    fetchNotifications();
  }, [filter]);

  const deleteNotification = async (id) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return;
      }

      await axios.delete(`/notifications/${id}`, {
        ...apiConfig,
        headers: {
          ...apiConfig.headers,
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      setSuccessMessage('Notification deleted successfully!');
    } catch (error) {
      console.error('Error deleting notification:', error);
      setErrorMessage('Error deleting notification.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Notifications</h1>
      <div className="mb-3">
        <label className="form-label">Filter by Status:</label>
        <select className="form-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="unread">Unread</option>
          <option value="approved">Approved</option>
          <option value="unapproved">Unapproved</option>
        </select>
      </div>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.id}</td>
                <td>{notification.status}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => deleteNotification(notification.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
    </div>
  );
};

export default NotificationsPage;
