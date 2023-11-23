import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error,setError]=useState('');
  const [password, setPassword] = useState('');
  const [showContactPopup, setShowContactPopup] = useState(false); // State to control the pop-up
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiUrl}/api/v1/login`, {
        user: {
          email: email,
          password: password,
        },
      },
      );

      if (response.status === 200) {
        

        // If JWT token is returned, store it for later use
        if (response.data && response.data.jwt) {
          sessionStorage.setItem('token', response.data.jwt);
         

          sessionStorage.setItem('refreshNeeded', 'true');

          // After successful login, navigate to the campaigns page
          router.push('/campaigns');
        }
      } else {    
        setError(response.data.error || 'Unknown error occurred');
      }
    } catch (error) {
      
      setError('Please Check your Account Details and try again', error);
    }
  };

  const handleForgotPasswordClick = () => {
    // Show the contact pop-up when "Forgot Password?" is clicked
    setShowContactPopup(true);
  };

  const handleCloseContactPopup = () => {
    // Close the contact pop-up when the user clicks the close button
    setShowContactPopup(false);
  };

  return (
    <div className="container">
      {/* Login Form */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Login</h1>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    autoComplete="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    autoComplete="password" 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Login</button>
              </form>
              {error && <p className="alert alert-danger">{error}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* "Forgot Password?" Link */}
      <div className="text-center">
        <button className="btn btn-link" onClick={handleForgotPasswordClick}>
          Forgot Password?
        </button>
      </div>

      {/* Contact Pop-up */}
      {showContactPopup && (
        <div className="contact-popup">
          <div className="contact-content">
            <button className="close-button" onClick={handleCloseContactPopup}>
              <span className="close-button-icon">&times;</span>
            </button>
            <p className="contact-email">Please email us at <a href="mailto:admin@awareshare.com">admin@awareshare.com</a> for assistance with password reset.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .contact-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }

        .contact-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          position: relative;
        }

        .close-button {
          position: absolute;
          top: 0px;
          right: 10px;
          font-size: 20px;
          cursor: pointer;
          background: none;
          border: none;
        }

        .close-button-icon {
          color: red; /* Red color for close button */
        }

        .contact-email a {
          color: blue; /* Blue color for the email link */
          text-decoration: none;
        }

        .contact-email a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
