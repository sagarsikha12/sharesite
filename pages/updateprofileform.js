import { useState, useRef, useEffect } from 'react';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function UpdateProfileForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  useEffect(() => {
    // Fetch the user's current information and pre-fill the form fields
    const fetchUserData = async () => {
      setIsUpdating(true); // Show a spinner while fetching data
      try {
        const response = await fetch(`${apiUrl}/api/v1/profile_detail`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Replace with your authentication method
          },
        });
       

        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setFormData({
            first_name: userData.first_name,
            last_name: userData.last_name,
            username: userData.username,
            email: userData.email,
          });
          setIsEditing(false); // Disable editing initially
        } else {
          // Handle error if fetching user data fails
          // You can redirect to a login page or show an error message
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsUpdating(false); // Hide the spinner
      }
    };

    fetchUserData();
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  const handleEditClick = () => {
    setIsEditing(true); // Enable editing when the Edit button is clicked
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: formData,
    };

    try {
      setIsUpdating(true); // Show a spinner while updating
      const response = await fetch(`${apiUrl}/api/v1/update_profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`, // Replace with your authentication method
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setErrors([]);
        setSuccessMessage('Profile updated successfully');
        setIsSuccessVisible(true);
        setIsEditing(false); // Disable editing after successful update
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false); // Hide the spinner
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Update Profile</h1>
              <button
                type="button"
                className="btn btn-primary float-right"
                onClick={handleEditClick}
                disabled={isUpdating}
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
              {errors.length > 0 && (
                <div className="alert alert-danger">
                  <h3 className="alert-heading">Errors:</h3>
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              {isSuccessVisible && (
                <div className="alert alert-success">
                  <strong>Success:</strong> {successMessage}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    ref={firstNameRef}
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    ref={lastNameRef}
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    ref={usernameRef}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    autoComplete="new-username"
                    required
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    ref={emailRef}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    autoComplete="new-email"
                    required
                    disabled={!isEditing || isUpdating}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  {isUpdating ? (
                    <>
                     
                      <i className='fa fa-spinner fa-spin'></i>
                      {' Updating...'}
                    </>
                  ) : (
                    <>
                    <i className='fa fa-check'></i>
                    {' Update Profile'}
                    </>
                    
                    
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfileForm;
