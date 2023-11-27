import React, { useState } from 'react';

const Footer = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleHelpClick = () => {
    setShowMessage(true);
    // Optionally, you can set a timer to automatically hide the message after a few seconds
    setTimeout(() => setShowMessage(false), 150000);
  };

  return (
    <footer className="bg-primary mt-auto py-3 text-white text-center p-3">
      <style jsx>{`
        .support-message {
          color: #f8f9fa;
         
        }
        .mailto-link {
          color: black;
          /* Additional styles if needed */
        }
      `}</style>

      <button onClick={handleHelpClick} className="btn btn-light">
        Help and Support
      </button>
      {showMessage && (
        <p className="support-message">
          Please email to{' '}
          <a href="mailto:admin@awaresite.com" className="mailto-link">
            admin@awaresite.com
          </a>{' '}
          for any queries.
        </p>
      )}
      © AwareShare Site 2023
    </footer>
  );
};

export default Footer;
