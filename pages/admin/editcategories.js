import { useState, useEffect } from 'react';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const CategoryList = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(0);
  const [editableCategories, setEditableCategories] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    const apiConfig = {
      baseURL: `${apiUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      // Fetch user data using your API
      axios
        .get('/categories', apiConfig)
        .then((response) => {
          console.log(response);
          const categoryData = response.data;

          if (Array.isArray(categoryData)) {
            setCategories(categoryData);
            setTotalCategories(categoryData.length);

            // Filter categories based on the search input
            const filtered = categoryData.filter((category) =>
              category.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredCategories(filtered);
          } else {
            console.error('Invalid category data:', categoryData);
          }

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error('Error fetching categories:', error);
        });
    }
  }, [search]);

  const handleDeleteCategory = (categoryId) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (confirmed) {
      // Implement the delete category logic here
      // Make an API request to delete the category by categoryId
      console.log(`Delete category with ID: ${categoryId}`);
    }
  };

  const handleEditCategory = (category) => {
    // Enable editing for the category
    setEditableCategories((prevEditableCategories) => ({
      ...prevEditableCategories,
      [category.id]: true,
    }));
  };

  const handleSaveCategory = (category) => {
    // Disable editing for the category
    setEditableCategories((prevEditableCategories) => ({
      ...prevEditableCategories,
      [category.id]: false,
    }));

    // Make an API request to update the category name
    const token = sessionStorage.getItem('token');
    if (token) {
      const apiConfig = {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      axios
        .put(`/categories/${category.id}`, { name: category.name }, apiConfig)
        .then((response) => {
          // Handle successful update
          setSuccessMessage(`Category updated`);
          setErrorMessage('');
        })
        .catch((error) => {
          // Handle error
          setSuccessMessage('');
          setErrorMessage(`Error updating category: ${error.message}`);
        });
    }
  };

  return (
    <div>
      <h1 className="text-center">Category List</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p>Total Categories: {totalCategories}</p>
          <input
            type="text"
            placeholder="Search categories"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control mb-3"
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
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {editableCategories[category.id] ? (
                      <>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => {
                            // Update the category name when edited
                            setCategories((prevCategories) => {
                              const updatedCategories = [...prevCategories];
                              const index = updatedCategories.findIndex((c) => c.id === category.id);
                              if (index !== -1) {
                                updatedCategories[index].name = e.target.value;
                              }
                              return updatedCategories;
                            });
                          }}
                        />
                        <button
                          className="btn btn-success"
                          onClick={() => handleSaveCategory(category)}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        {category.name}
                        <button
                          className="btn btn-primary ml-2"
                          onClick={() => handleEditCategory(category)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      Delete
                    </button>
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

export default CategoryList;
