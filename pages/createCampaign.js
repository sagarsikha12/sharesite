import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic';
import { EditorState, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Import the Editor component dynamically without SSR
const WysiwygEditorNoSSR = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

export default function CreateCampaignPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  // Editor state for the rich text editor
  const [contentEditorState, setContentEditorState] = useState(
    EditorState.createWithContent(ContentState.createFromText(''))
  );

  // State to control the custom modal visibility and countdown
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [countdown, setCountdown] = useState(10);

  // Function to open the custom modal
  const openSuccessModal = () => {
    setShowSuccessModal(true);

    // Start the countdown
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to home page after countdown
    setTimeout(() => {
      router.push('/campaigns');
      clearInterval(interval);
    }, 10000);
  };

  // Function to close the custom modal
  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const renderImagePreview = () => {
    if (coverImage) {
      return URL.createObjectURL(coverImage);
    } else if (coverImageUrl) {
      return coverImageUrl;
    }
    return null; // No image selected or provided
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const apiConfig = {
      baseURL: `${apiUrl}/api/v1`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    axios
      .get('/users/current', apiConfig)
      .then((response) => {
        setCurrentUser(response.data.user);
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
        router.push('/login');
      });

    axios
      .get('/categories', apiConfig)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [router]);

  function isContentEmpty(htmlContent) {
    // Remove HTML tags and check if any text content remains
    const textContent = htmlContent.replace(/<[^>]*>/g, '').trim();
    return textContent === '';
  }

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const editorContent = stateToHTML(contentEditorState.getCurrentContent());

    if (!title) {
      setError('Please fill required fields.');
      setIsSubmitting(false);
      return;
    } else if (!coverImage && !coverImageUrl) {
      // Check if both cover image and cover image URL are not provided
      setError('Please provide a Cover Image either by uploading or via URL.');
      setIsSubmitting(false);
      return;
    } else if (coverImage && coverImageUrl) {
      // Check if both cover image and cover image URL are provided
      setError('Please provide only one Cover Image, either by uploading or via URL.');
      setIsSubmitting(false);
      return;
    } else if (!category) {
      setError('Please select One category or create new ');
      setIsSubmitting(false);
      return;
    } else if (isContentEmpty(editorContent)) {
      setError('Content cannot be blank');
      setIsSubmitting(false);
      return;
    }

    // Convert the editor content to HTML or JSON format based on your API's requirements
    // You'll need to implement this part according to your backend API

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category_id', category);

    if (coverImage) {
      formData.append('cover_image', coverImage); // File upload
    } else if (coverImageUrl) {
      formData.append('cover_image_url', coverImageUrl); // URL provided
    }
    formData.append('content', editorContent);

    try {
      const response = await axios.post(`${apiUrl}/api/v1/campaigns`, formData, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        // Display success message in custom modal
        setSuccessMessage(
          'Campaign created successfully. Your campaign has been submitted for review and once it is accepted it will be publicly available. You can check status in my campaign.'
        );

        // Show the custom modal
        openSuccessModal();
      } else {
        console.error('Campaign creation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsSubmitting(false);
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
    .submitting-message {
      text-align: center;
      margin-top: 20px;
    }
    .spinner-border {
      margin-bottom: 10px;
    }
    .error {
      color: red;
      font-weight: bold;
    }
    /* Add additional styles for the custom modal */
    .custom-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .modal-content {
      background-color: #fff;
      padding: 20px;
      border-radius: 4px;
      text-align: center;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }
  `;

  return (
    <div>
      {isSubmitting && (
        <div className="submitting-message">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>
            {' '}
            Please Wait.. Your campaign is being submitted for review and once it is accepted it will be publicly available.
            You can check status in my campaign.
          </p>
          <button className="btn btn-danger" onClick={() => setIsSubmitting(false)}>
            Cancel
          </button>
        </div>
      )}
      <Head>
        <title>Create a New Campaign</title>
      </Head>
      <style jsx>{styles}</style>
      <div className="container">
        <h1 className="mt-4">Create a New Campaign</h1>
        {error && <p className="alert alert-danger">{error}</p>}
        <form onSubmit={handleCreateCampaign}>
          {/* Form fields for title, category, cover image, and content */}
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              className="form-control-file"
              id="coverImage"
              accept="image/*"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
            <small className="form-text text-muted">
            Note: Locally uploaded images will be removed after 24 hours. For permanent image hosting, you can use image address from google or use a Dropbox: Steps
              for dropbox share: Dropbox Dropbox&apos;s shared links can be used more reliably for images: Create a Shareable
              Link: Right-click on the file in Dropbox and select &apos;Copy link&apos;. Modify the URL: Change the dl=0 at the
              end of the URL to raw=1. For example, change https://www.dropbox.com/s/xxxxx/photo.jpg?dl=0 to
              https://www.dropbox.com/s/xxxxx/photo.jpg?raw=1.            </small>
            <input
              type="text"
              className="form-control mt-2"
              id="coverImageUrl"
              placeholder="Or paste image URL"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
            />
          </div>
          <div className="image-preview">
            {renderImagePreview() && (
              <img
                src={renderImagePreview()}
                alt="Cover Preview"
                style={{ maxWidth: '100%', maxHeight: '300px' }}
              />
            )}
          </div>
          <div className="editor-wrapper">
            <label>Campaign Content</label>
            <div>
              <WysiwygEditorNoSSR
                editorState={contentEditorState}
                onEditorStateChange={setContentEditorState}
                wrapperClassName="wysiwyg-wrapper"
                editorClassName="wysiwyg-editor"
                toolbarClassName="wysiwyg-toolbar"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Create Campaign
          </button>
        </form>
      </div>

      {/* Custom Modal for Success Message */}
      {showSuccessModal && (
        <div className="custom-modal">
          <div className="modal-content">
            <p>{successMessage}</p>
            {countdown > 0 && <p className="countdown">Redirecting in {countdown} seconds...</p>}
            <button className="btn btn-secondary" onClick={closeSuccessModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
