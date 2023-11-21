import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html'; // Import stateToHTML function
import { convertFromHTML } from 'draft-convert'; // Import convertFromHTML function

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Import Draft.js components dynamically
const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), {
  ssr: false,
});

const EditCampaignPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [campaign, setCampaign] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: EditorState.createEmpty(),
    cover_image: null,
    cover_image_url: '',
  });

  useEffect(() => {
    async function fetchCampaignData() {
      const response = await fetch(`${apiUrl}/campaigns/${id}.json`);
      const data = await response.json();
      setCampaign(data);

      // Check if data.content is defined before converting
      if (data.content) {
        const contentState = convertFromHTML(data.content);
        setFormData({
          title: data.title,
          content: EditorState.createWithContent(contentState),
          cover_image_url: data.cover_image_url,
          cover_image: data.cover_image,
        });
      }
    }

    if (id) {
      fetchCampaignData();
    }
  }, [id]);

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
    }

    try {
      const response = await axios.put(`${apiUrl}/api/v1/campaigns/${id}.json`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        router.push(`/campaigns/${id}.json`);
      } else {
        console.error('Campaign update failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
    }
  };

  return (
    <div className="edit-container">
      <Head>
        <title>Edit Campaign</title>
      </Head>
      <h1>Edit Campaign</h1>

      {campaign && (
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
            <img src={formData.cover_image_url} alt="Cover" />
          </div>
          <div className="input-group">
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="coverImage"
                onChange={handleImageUpload}
              />
              <label className="custom-file-label" htmlFor="coverImage">
                Choose file
              </label>
            </div>
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

          <div className="input-group">
            <button className='btn btn-success' type="submit">Update Campaign</button>
          </div>
        </form>
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

export default EditCampaignPage;
