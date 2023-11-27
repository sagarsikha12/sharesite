import { useState, useRef } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function SignUpForm() {
  const initialFormData = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // Create refs for each input field
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user: formData
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        
        setErrors([]);
        setSuccessMessage('Registration successful');
        setIsSuccessVisible(true);

        // Clear the form fields individually by resetting their values
        firstNameRef.current.value = '';
        lastNameRef.current.value = '';
        usernameRef.current.value = '';
        emailRef.current.value = '';
        passwordRef.current.value = '';
        passwordConfirmationRef.current.value = '';
        window.location.reload();
      } else {
        console.log('registration error');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Sign Up </h1>
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
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    ref={passwordRef}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    autoComplete="new-password" 
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    name="password_confirmation"
                    ref={passwordConfirmationRef}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    autoComplete="new-password" 
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpForm;
