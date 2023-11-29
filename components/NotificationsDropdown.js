import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Get the JWT token from sessionStorage
      const response = await axios.get( `${apiUrl}/api/v1/notifications`,{
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the headers
        },
      });
      const data = response.data;
     
      setNotifications(data);
      setUnreadNotificationsCount(data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  // Function to delete all notifications
  const deleteAllNotifications = async () => {
    try {
      const token = sessionStorage.getItem('token');
      // Make an API request to delete all notifications
      await axios.delete(`${apiUrl}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Clear the notifications list and set unread count to zero
      setNotifications([]);
      setUnreadNotificationsCount(0);
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };


  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = sessionStorage.getItem('token'); // Get the JWT token from sessionStorage
      await axios.put( `${apiUrl}/api/v1/notifications/${notificationId}`,null, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the JWT token in the headers
        },
      });

      // Update the notification count
      setUnreadNotificationsCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();
  }, []);
  // Helper function to determine the notification message and URL based on status
  const getNotificationMessageAndUrl = (notification) => {
    if (notification.status === 'unapproved') {
      return {
        message: `Admin Approval is required for campaign with ID: ${notification.campaign_id}`,
        url: `/admin/campaigns/`
      };
    } else {
      return {
        message: `New Campaign added with campaign ID: ${notification.campaign_id}`,
        url: `/campaigns/${notification.campaign_id}.json`
      };
    }
  };

  return (
    <div className="notification-area"   >
      <div className="dropdown"  >
        <a 
          className="nav-link dropdown-toggle" 
          href="#"
          id="notification-dropdown"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          onClick={fetchNotifications}
        >
          <i className="fa fa-bell" style={{color:"black"}}></i>
          {unreadNotificationsCount > 0 && (
            <span className="badge badge-danger" id="unread-notifications-count">
              {unreadNotificationsCount}
            </span>
          )}
        </a>
        
        <div className="dropdown-menu" aria-labelledby="notification-dropdown">
          <div className="notification-menu-header">
            
            {(
              <button className="btn btn-danger" onClick={deleteAllNotifications}>

               
                          <i className="fa-solid fa-trash "></i> &nbsp;Delete Unnecessary Notifications
              </button>
            )}
          </div>
          <div className="notification-menu-content">
            {notifications.length === 0 ? (
              <p>No new notifications</p>
            ) : (
              <ul className="notification-list">
                {notifications.map((notification) => {
                  const { message, url } = getNotificationMessageAndUrl(notification);

                  return (
                    <li key={notification.id}>
                      <a
                        href={url}
                        onClick={() => markNotificationAsRead(notification.id)}
                      >
                        {message}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
<style jsx>{`
    .dropdown-toggle::after {
       
        color: white;
        
    }
`}</style>

export default NotificationsDropdown;
