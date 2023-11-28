import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.reset_password_token) {
      setResetToken(router.query.reset_password_token);
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.put(`${apiUrl}/users/password`, {
        user: {
          reset_password_token: resetToken,
          password: newPassword,
          password_confirmation: confirmPassword,
        },
      });

      if (response.status === 200) {
        setSuccess(true);
        // setTimeout(() => router.push('/login'), 3000);
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'An error occurred.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {success ? (
        <p>Password successfully reset. You can now log in with your new password.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="new-password">New Password</label>
            <div className="password-input">
              <input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <div className="password-input">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span className="password-toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit">Reset Password</button>
        </form>
      )}

      <style jsx>{`
        .reset-password-container {
          max-width: 400px;
          margin: auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .password-input {
          position: relative;
        }

        .password-toggle-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }

        .error {
          color: red;
        }
      `}</style>
    </div>
  );
}
