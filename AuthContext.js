import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      const apiConfig = {
        baseURL: 'http://localhost:4000/api/v1',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      axios.get('/users/current', apiConfig)
        .then(response => {
          setIsAuthenticated(true);
        })
        .catch(error => {
          console.error('Error fetching user:', error);
        });
    }
  }, []); // We don't need setIsAuthenticated as a dependency here since it's a setState function

  const logout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
