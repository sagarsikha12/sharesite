import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';




// Import the NotificationsDropdown component
import NotificationsDropdown from './NotificationsDropdown';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const token = sessionStorage.getItem('token');

    if (token) {
      // Fetch user data using your API
      const apiConfig = {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      axios.get('/users/current', apiConfig)
        .then(response => {
          setIsAuthenticated(true);
          setUser(response.data.user);
          
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, [setIsAuthenticated]);

  const handleLogout = () => {
    // Clear the token and log the user out
    sessionStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };


  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-primary">
      <Link href="/campaigns" className="navbar-brand">AwareShare</Link>

      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ml-auto">
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <span className="navbar-text mr-3">Welcome, {user ? user.email : ''}!</span>
              </li>
               {/* Bell icon */}
               <li className="nav-item mr-3">
              
              <NotificationsDropdown />
            </li>
              <li className="nav-item">
                <Link href="/mycampaign" className="nav-link">My Campaigns</Link>
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
                <Link href="/admin/campaigns" className="dropdown-item">
                  Review Requests
                </Link>
                <Link href="/admin/Userlist" className="dropdown-item">
                  Manage users 
                </Link>
                <Link href="/admin/clearnotifications" className="dropdown-item">
                   Clear notifications 
                </Link>
                <Link href="/admin/editcategories" className="dropdown-item">
                   Manage Categories
                </Link>
                <Link href="/admin/managecampaigns" className="dropdown-item">
                   Manage Campaigns
                </Link>
                {/* Add more admin-related links here */}
              </div>
            </li>
          )}
              <li className="nav-item">
                <Link href="/createCampaign" className="nav-link">New Campaign</Link>
              </li>
              <li className="nav-item">
                <Link href="/addcategorypage" className="nav-link">New Category</Link>
              </li>
             
              <li className="nav-item">
                <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
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
                <Link href="/signup" passHref>
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
