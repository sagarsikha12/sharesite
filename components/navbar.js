import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import NotificationsDropdown from './notificationsDropdown.js';
// Import the NotificationsDropdown component


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const token = sessionStorage.getItem('token');

    if (token) {
      // Fetch user data using your API
      const apiConfig = {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      axios
        .get('/users/current', apiConfig)
        .then((response) => {
          setIsAuthenticated(true);
          setUser(response.data.user);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    // Clear the token and log the user out
    sessionStorage.removeItem('token');
    router.push('/campaigns');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-primary">
      <Link href="/campaigns" className="navbar-brand">
        AwareShare
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <style>
        {`
          /* Custom CSS class for dropdown items */
          .custom-dropdown-item {
            border: 1px solid lightblue; /* Border color */
            background-color: white; /* Default background color */
            color: black; /* Default text color */
            /* Add more custom styles as needed */
          }

          /* Custom CSS class for dropdown items on hover */
          .custom-dropdown-item:hover {
            background-color: blue; /* Background color on hover */
            color: white; /* Text color on hover */
            /* Add more custom styles for hover effect */
          }
        `}
      </style>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="navbar-text mr-3">
                  Welcome, {user ? user.email : ''}!
                </span>
              </li>
              {/* Bell icon */}
              <li className="nav-item mr-3">
                <NotificationsDropdown />
              </li>
              <li className="nav-item">
                <Link href="/myCampaign" className="nav-link">
                  My Campaigns
                </Link>
              </li>

              {user && user.admin && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="adminDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Admin
                  </a>
                  <div className="dropdown-menu" aria-labelledby="adminDropdown">
                    <Link
                      href="/admin/campaigns"
                      className="dropdown-item custom-dropdown-item"
                    >
                      Review Requests
                    </Link>
                    <Link
                      href="/admin/userList"
                      className="dropdown-item custom-dropdown-item"
                    >
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/manageNotification"
                      className="dropdown-item custom-dropdown-item"
                    >
                      Manage Notifications
                    </Link>
                    <Link
                      href="/admin/editCategories"
                      className="dropdown-item custom-dropdown-item"
                    >
                      Manage Categories
                    </Link>
                    <Link
                      href="/admin/manageCampaigns"
                      className="dropdown-item custom-dropdown-item"
                    >
                      Manage Campaigns
                    </Link>
                    {/* Add more admin-related links here */}
                  </div>
                </li>
              )}
              <li className="nav-item">
                <Link href="/createCampaign" className="nav-link">
                  New Campaign
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/addCategoryPage" className="nav-link">
                  New Category
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="userDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa-regular fa-circle-user fa-fade fa-2xl"></i>
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right bg-light"
                  aria-labelledby="userDropdown"
                >
                  <Link
                    href="/passwordChange"
                    className="dropdown-item custom-dropdown-item"
                  >
                    Change Password
                  </Link>
                  <Link
                    href="/updateProfileForm"
                    className="dropdown-item custom-dropdown-item"
                  >
                    Update Profile
                  </Link>
                  <div className="dropdown-item" onClick={handleLogout}>
                    <button className="btn btn-danger" onClick={handleLogout}>
                      Logout&nbsp;
                      <i className="fa-solid fa-right-from-bracket"></i>
                    </button>
                  </div>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link href="/login" passHref>
                  <button className="btn btn-info mr-2">Login</button>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/signUp" passHref>
                  <button className="btn btn-info">SignUp</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
