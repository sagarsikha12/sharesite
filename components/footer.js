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
        .mailto-link {
          color: black; /* Change the email link color to black */
        }
        .help-button {
          color: white;
          background-color: transparent;
          border: 1px solid black;
        }
        .help-button:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .support-message {
          position: relative;
          padding-right: 30px; /* Add padding for the close button */
        }
        .close-button {
          position: absolute;
          top: 5px; /* Adjust top position for better alignment */
          right: 5px; /* Adjust right position for better alignment */
          background-color: red;
          color: white;
          border: red;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%; /* Make it round */
        }
      `}</style>

      <button onClick={handleHelpClick} className="btn btn-info">
        <i className="fa-regular fa-envelope"></i>&nbsp;
        Help and Support
      </button>
      {showMessage && (
        <div className="support-message">
          <p>
            Please email to{' '}
            <a href="mailto:awareshare2023@gmail.com" className="mailto-link">
              awareshare2023@gmail.com
            </a>{' '}
            for any queries.
          </p>
          <button onClick={handleCloseMessage} className="close-button">
            &times;
          </button>
        </div>
      )}
      <br />
      © AwareShare Site 2023
    </footer>
  );
};

export default Footer;
