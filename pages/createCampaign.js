import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Import the Editor component dynamically without SSR
const WysiwygEditorNoSSR = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

export default function CreateCampaignPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Editor state for the rich text editor
  const [contentEditorState, setContentEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const apiConfig = {
      baseURL: `${apiUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    axios.get('/users/current', apiConfig)
      .then(response => {
        setCurrentUser(response.data.user);
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        router.push('/login');
      });

    axios.get('/categories', apiConfig)
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, [router]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();

    if (!title  ) {
      setError('Please fill required fields.');
      return;
    }else if (!coverImage ){
      setError('Please choose at least one Cover Image');
      return;
    }else if(!category){
      setError('Please select One category or create new ')
      return;
    }else if(!contentEditorState){
      setError('Content cannot be blank');
      return;
    }

    // Convert the editor content to HTML or JSON format based on your API's requirements
    // You'll need to implement this part according to your backend API
   
    const editorContent = stateToHTML(contentEditorState.getCurrentContent());

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category);
    formData.append('cover_image', coverImage);
    formData.append('content', editorContent);

    try {
      const response = await axios.post(`${apiUrl}/api/v1/campaigns`, formData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        router.push('/campaigns');
      } else {
        console.error('Campaign creation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };
  // Define your CSS styles outside the return statement
  const styles = `
    .editor-wrapper {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 8px;
      margin-bottom: 20px;
    }
  `;

  return (
    <div>
      <Head>
        <title>Create a New Campaign</title>
      </Head>
      <style jsx>{styles}</style>
      <div className="container">
        <h1 className="mt-4">Create a New Campaign</h1>
        <p>Current User Email: {currentUser?.email}</p>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleCreateCampaign}>
          {/* Form fields for title, category, cover image, and content */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title" required />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select className="form-control" id="category" value={category} onChange={e => setCategory(e.target.value)} required>
              <option value="">Select a Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input type="file" className="form-control-file" id="coverImage" accept="image/*" onChange={e => setCoverImage(e.target.files[0])} required />
          </div>
          <div className="editor-wrapper">
          <label >Campaign Content</label>
          <div> {/* Assign an id to the wrapper */}
            {/* Use the rich text editor */}
            <WysiwygEditorNoSSR
              editorState={contentEditorState}
              onEditorStateChange={setContentEditorState}
            />
          </div>
        </div>

          <button type="submit" className="btn btn-primary">Create Campaign</button>
        </form>
      </div>
    </div>
  );
  
  
}
