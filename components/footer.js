import React, { useState } from 'react';

const Footer = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleHelpClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 180000); // 3 minutes
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <footer className="bg-primary mt-auto py-3 text-white text-center p-3">
      <style jsx>{`
        .support-message {
          color: #f8f9fa;
          position: relative; /* For positioning the close button */
        }
        .mailto-link {
          color: white;
          border: 1px solid black;
        }
        .help-button {
          color: white;
          background-color: transparent;
          border: 1px solid black;
        }
        .help-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .close-button {
          position: absolute;
          top: 0;
          right: 0;
          color: white;
          background: red;
          border: red;
          cursor: pointer;
        }
      `}</style>

      <button onClick={handleHelpClick} className="btn btn-info">
        Help and Support
      </button>
      {showMessage && (
        <p className="support-message">
          Please email to{' '}
          <a href="mailto:awareshare2023@gmail.com" className="mailto-link">
            awareshare2023@gmail.com
          </a>{' '}
          for any queries.
          <button onClick={handleCloseMessage} className="close-button">
            &times; {/* This is a commonly used symbol for close buttons */}
          </button>
        </p>
      )}
      <br />
      © AwareShare Site 2023
    </footer>
  );
};

export default Footer;
