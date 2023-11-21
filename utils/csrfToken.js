// utils/csrfToken.js
import Cookies from 'js-cookie';


// ...

const fetchCsrfToken = async () => {
  try {
    const response = await fetch('http://localhost:4000/csrf_token', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const csrfToken = Cookies.get('cfctoken');
      return csrfToken;
    } else {
      console.error('Failed to fetch CSRF token:', response.statusText);
      return null;
    }
  } catch (error) {
    console.error('Network or server error:', error);
    return null;
  }
};

// ...


