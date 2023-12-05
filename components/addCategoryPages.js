import { useState } from 'react';
import { useRouter } from 'next/router';


const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const AddCategoryPage = () => {
    const Router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    // ... any other fields
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    try {
        const response = await fetch( `${apiUrl}/api/v1/categories`,{
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });

      if (!response.ok) {
        throw new Error('Category creation failed');
      }

      alert('Category added successfully');
      Router.push('/myCampaigns');
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Add New Category</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="5"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
