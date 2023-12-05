import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const updateUserList = (updatedUsers) => {
    setUsers(updatedUsers);
    setTotalUsers(updatedUsers.length);
    const filtered = updatedUsers.filter((user) =>
      user.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
  
    if (token) {
      const apiConfig = {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
  
      axios.get('/users', apiConfig)
        .then(response => {
          const userData = response.data.users;
  
          if (Array.isArray(userData)) {
            setUsers(userData);
   
            setTotalUsers(userData.length);
  
            const filtered = userData.filter((user) =>
              user.email.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredUsers(filtered);
  
            // After fetching users, determine if the current user is a super admin
            const currentUserEmail = sessionStorage.getItem('email');
            console.log('Current user email:',currentUserEmail);
            const currentUser = userData.find(user => user.email === currentUserEmail);
  
           

            if (currentUser) {
              setIsSuperAdmin(currentUser.isSuperAdmin);
            } else {
              setIsSuperAdmin(false); // Current user not found, set to false
            }
          } else {
            console.error('Invalid user data:', userData);
          }
  
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching user:', error);
        });
    }
  }, [search]);
  

  const handleDeleteAdmin = (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete admin status for this user?");
    if (confirmed) {
      const token = sessionStorage.getItem('token');
      if (token) {
        const apiConfig = {
          baseURL: `${apiUrl}/api/v1`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        axios.patch(`/delete_admin/${userId}`, {}, apiConfig)
        .then(response => {
          updateUserList(users.map(user => {
            if (user.id === userId) {
              return { ...user, admin: false };
            }
            return user;
          }));
          setSuccessMessage(`Admin status removed for user with ID ${userId}.`);
          setErrorMessage('');
        })
        .catch(error => {
          console.error(`Error removing admin status for user with ID ${userId}:`, error);
          setSuccessMessage('');
          setErrorMessage(`Error removing admin status for user with ID ${userId}: ${error.message}`);
        });
      
      }
    }
  };

  const handleMakeAdmin = (userId) => {
    const confirmed = window.confirm("Are you sure you want to make this user an admin?");
    if (confirmed) {
      const token = sessionStorage.getItem('token');
      if (token) {
        const apiConfig = {
          baseURL: `${apiUrl}/api/v1`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        axios.patch(`/users/${userId}/make_admin`, {}, apiConfig)
          .then(response => {
            updateUserList(users.map(user => {
              if (user.id === userId) {
                return { ...user, admin: true };
              }
              return user;
            }));
            setSuccessMessage(`User with ID ${userId} has been made an admin.`);
            setErrorMessage('');
          })
          .catch(error => {
            console.error(`Error making user with ID ${userId} an admin:`, error);
            setSuccessMessage('');
            setErrorMessage(`Error making user with ID ${userId} an admin: ${error.message}`);
          });
      }
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      const token = sessionStorage.getItem('token');
      if (token) {
        const apiConfig = {
          baseURL: `${apiUrl}/api/v1`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        axios.delete(`/users/${userId}`, apiConfig)
          .then(response => {
            updateUserList(users.filter(user => user.id !== userId));
            setSuccessMessage(`User with ID ${userId} has been deleted.`);
            setErrorMessage('');
          })
          .catch(error => {
            console.error(`Error deleting user with ID ${userId}:`, error);
            setSuccessMessage('');
            setErrorMessage(`Error deleting user with ID ${userId}: ${error.message}`);
          });
      }
    }
  };

  return (
    <div>
      <h1 className="text-center">User List</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p>Total Users: {totalUsers}</p>
          <input
            type="text"
            placeholder="Search users by Email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Email</th>
                <th>Admin</th>
                <th>Super Admin</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.admin ? 'Yes' : 'No'}</td>
                  <td>{user.isSuperAdmin ? 'Yes' : 'No'}</td>
                  <td>{user.created_at}</td>
                  <td>
                    {user.admin && !user.isSuperAdmin && (
                      <button
                        className="btn btn-warning"
                        onClick={() => handleDeleteAdmin(user.id)}
                      >
                        Delete Admin&nbsp;
                        <i className="fa-solid fa-user-minus"></i>
                      </button>
                    )}
                    {!user.admin && (
                      <>
                        
                          <button
                            className="btn btn-primary"
                            onClick={() => handleMakeAdmin(user.id)}
                          >
                            Make Admin&nbsp;
                            <i className="fa-solid fa-user-tie"></i>
                          </button>

                          <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete&nbsp;
                      <i className="fa-solid fa-trash"></i>
                    </button>
                      
                      </>
                    )}
                    {user.isSuperAdmin &&(
                      <>
                      Super Admin </>
                    )}
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default UserList;
