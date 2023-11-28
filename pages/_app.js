import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar.js'; // Import the Navbar component
import Footer from '../components/footer.js';


function MyApp({ Component, pageProps }) {
  // Create a state variable to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const sessionKey = typeof window !== 'undefined' ? (sessionStorage.getItem('token') || 'logged-out') : 'logged-out';
  useEffect(() => {
   
    const loadScripts = () => {
      const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css';
    fontAwesomeLink.rel = 'stylesheet';

  // Append the Font Awesome CSS to the document
    
      // Add jQuery from CDN to the head of the document
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.5.1.slim.min.js';
      jqueryScript.crossOrigin = 'anonymous';
      jqueryScript.async = true;

      jqueryScript.onload = () => {
        // After jQuery is loaded, add Bootstrap JavaScript and Popper.js from CDNs
        const bootstrapScript = document.createElement('script');
        bootstrapScript.src = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js';
        bootstrapScript.integrity = 'sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV';
        bootstrapScript.crossOrigin = 'anonymous';
        bootstrapScript.async = true;

        const popperScript = document.createElement('script');
        popperScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js';
        popperScript.integrity = 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo';
        popperScript.crossOrigin = 'anonymous';
        popperScript.async = true;

        // Add Bootstrap CSS from CDN to the head of the document
        const link = document.createElement('link');
        link.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css';
        link.rel = 'stylesheet';

        // Append the scripts and styles to the document
        document.head.appendChild(link);
        document.head.appendChild(bootstrapScript);
        document.head.appendChild(popperScript);
        document.head.appendChild(fontAwesomeLink);
      };

      // Append jQuery script to the document
      document.head.appendChild(jqueryScript);
    };

    loadScripts();

    return () => {
      // Remove the Bootstrap CSS, jQuery, JavaScript, and Popper.js when the component is unmounted
      const scripts = document.querySelectorAll('script[src*="bootstrap"], script[src*="popper"]');
      scripts.forEach((script) => {
        document.head.removeChild(script);
      });
      const fontAwesomeLink = document.querySelector('link[href*="font-awesome"]');
      if (fontAwesomeLink) {
          document.head.removeChild(fontAwesomeLink);
          }

      const link = document.querySelector('link[href*="bootstrap.min.css"]');
      if (link) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // In MyApp component
// Add a key that depends on isAuthenticated
return (
  
  
  <div className="d-flex flex-column min-vh-100" key={sessionKey}>
    
    <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    <div className="flex-grow-1">
    <Component {...pageProps} /> 
  </div>
   
    <Footer />
 
  </div>
);

}

export default MyApp;
