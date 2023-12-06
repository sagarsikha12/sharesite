import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { convertFromHTML } from 'draft-convert';
import withUserAuth from '../../withUserAuth';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

const EditCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: EditorState.createEmpty(),
    cover_image: null,
    cover_image_url: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isComponentMounted, setIsComponentMounted] = useState(true);


  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${apiUrl}/api/v1/users/current`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

         
          if (isComponentMounted) {
            setCurrentUser(response.data.user);
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUserData();
    return () => {
      setIsComponentMounted(false);
    };
  }, [isComponentMounted]);

  useEffect(() => {
    async function fetchCampaignData() {
      if (id && isComponentMounted) {
        try {
          const response = await fetch(`${apiUrl}/campaigns/${id}`);
          const data = await response.json();
          const contentState = data.content ? convertFromHTML(data.content) : ContentState.createFromText('');
          setFormData({
            title: data.title,
            content: EditorState.createWithContent(contentState),
            cover_image_url: data.cover_image_url,
            cover_image: null,
          });
        
          if (currentUser) {
            const isOwner = data.ownerId === currentUser.id;
            const isAdmin = currentUser.isAdmin;
            if (isOwner || isAdmin) {
              setIsAuthorized(true);
            } else {
              router.push('/unauthorized');
            }
          }
        } catch (error) {
          console.error('Error fetching campaign data:', error);
        }
      }
    }

    fetchCampaignData();
  }, [id,currentUser,router,isComponentMounted]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          cover_image: file,
          cover_image_url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    const contentHtml = stateToHTML(formData.content.getCurrentContent());
    const data = new FormData();

    data.append('title', formData.title);
    data.append('content', contentHtml);
    if (formData.cover_image) {
      data.append('cover_image', formData.cover_image);
    } else if (formData.cover_image_url) {
      data.append('cover_image_url', formData.cover_image_url);
    }

    try {
      const response = await axios.put(`${apiUrl}/api/v1/campaigns/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    
      if (response.status === 200) {
        setSuccess('Campaign updated successfully.');
        setError('');
        router.push(`/campaigns/${id}`);
      } else {
        setError('An error occurred while updating the campaign.');
        setSuccess('');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized: Please make sure you are the owner of this campaign');
        setSuccess('');
      } else {
        setError('An error occurred while updating the campaign.');
        setSuccess('');
      }
    }
    
  };

  if(!isAuthorized){
    return<div>Loading or unauthorized...</div>
  }

  return (
    <div className="edit-container">
      <Head>
        <title>Edit Campaign</title>
      </Head>
      <h1>Edit Campaign</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="image-holder">
          {formData.cover_image_url && <img src={formData.cover_image_url} alt="Cover" />}
        </div>
        <div className="input-group">
          <label>Upload Image:</label>
          <input
            type="file"
            name="cover_image"
            onChange={handleImageUpload}
          />
        </div>
        <div className="input-group">
          <label>Or Enter Image URL:</label>
          <input
            type="text"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={handleChange}
          />
        </div>
        <div className="input-group">
          <label>Content:</label>
          <div className="editor-wrapper">
            <Editor
              editorState={formData.content}
              onEditorStateChange={(content) => setFormData({ ...formData, content })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success">Update Campaign</button>
      </form>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success" role="alert">
          {success}
        </div>
      )}

<style jsx>{`
        .edit-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        h1 {
          text-align: center;
          margin-bottom: 20px;
        }

        .input-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 10px;
        }

        input, textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .image-holder {
          width: 200px;
          height: 200px;
          margin-bottom: 20px;
        }

        .image-holder img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .custom-file-label {
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .editor-wrapper {
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
          margin-bottom: 20px;
        }

        .btn-success {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};

export default withUserAuth(EditCampaignPage);
