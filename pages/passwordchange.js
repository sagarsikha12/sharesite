import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// PasswordInput component
const PasswordInput = ({ label, name, value, onChange, autoComplete }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          className="form-control"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <div className="input-group-append">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={toggleShowPassword}
          >
            <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

const PasswordChange = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    try {
      // Create an object to send as form data
      const toSendFormData = new FormData();
      toSendFormData.append('current_password', formData.oldPassword);
      toSendFormData.append('new_password', formData.newPassword);

      // Send a POST request with the form data
      const response = await axios.post(`${apiUrl}/api/v1/change-password`, toSendFormData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Password changed successfully');
        setErrors({});
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // Automatically clear success message after a few seconds (e.g., 5 seconds)
        setTimeout(() => {
          setSuccessMessage('');
        }, 5000);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setErrors({ newPassword: 'Your Password is less than 6 characters' });
        } else if (error.response.status === 401) {
          setErrors({ oldPassword: 'Incorrect old password' });
        } else {
          console.error(error);
        }
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
      <input type="text" autoComplete="username" name="username" id="username" value="" readOnly style={{ display: 'none' }} />
        <PasswordInput
          label="Old Password"
          name="oldPassword"
          value={formData.oldPassword}
          onChange={handleChange}
          autoComplete="current-password"
        />

        <PasswordInput
          label="New Password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        <PasswordInput
          label="Confirm New Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="new-password"
        />

        {errors.oldPassword && (
          <div className="text-danger">{errors.oldPassword}</div>
        )}

        {errors.newPassword && (
          <div className="text-danger">{errors.newPassword}</div>
        )}

        <div className="form-group">
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-lock" />&nbsp; Change Password
          </button>
        </div>
      </form>

      {successMessage && (
        <div className="mt-3 alert alert-success">
          {successMessage}
          <button
            type="button"
            className="close"
            onClick={() => setSuccessMessage('')}
          >
            <span>&times;</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordChange;
