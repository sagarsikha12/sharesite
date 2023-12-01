import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Campaign } from '../../types/types'; // Adjust the import path for your types

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Function to sanitize and truncate the content
const sanitizeAndTruncateContent = (content, maxLength) => {
  // Remove HTML tags using a regex
  const sanitizedContent = content.replace(/<[^>]+>/g, '');
  // Truncate the content to the specified maxLength
  if (sanitizedContent.length > maxLength) {
    return sanitizedContent.substr(0, maxLength) + '...';
  }
  return sanitizedContent;
};

const CampaignsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentCampaignUrl, setCurrentCampaignUrl] = useState('');
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
  const [copiedMessageVisible, setCopiedMessageVisible] = useState(false);

  useEffect(() => {
    async function fetchCampaignData() {
      try {
        const response = await fetch(`${apiUrl}/api/v1/campaigns`);
        const data = await response.json();
        setCampaignData(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    }

    fetchCampaignData();
  }, []);

  const handleShare = (campaignId: number) => {
    const url = window.location.origin + `/campaigns/${campaignId}`;
    setCurrentCampaignUrl(url);
    setShowModal(true);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedMessageVisible(true);
      setTimeout(() => {
        setCopiedMessageVisible(false);
      }, 3000);
    });
  };

  return (
    <div>
      <Head>
        <title>Campaigns</title>
      </Head>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span className="close close-button" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <br />
            <div className="url-container">
              <p className='alert'>{currentCampaignUrl}</p>
              <button className='btn btn-info' onClick={() => copyToClipboard(currentCampaignUrl)}>
                <i className="fa-regular fa-copy fa-bounce fa-xl"></i>
                Copy
              </button>
            </div>
            <div className="social-icons-container">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentCampaignUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <i className="fa-brands fa-square-facebook fa-beat-fade fa-2xl"></i>
              </a>
              {/* Add Instagram share */}
              <a href={`https://www.instagram.com/?url=${currentCampaignUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <i className="fa-brands fa-instagram fa-2x"></i>
              </a>
              {/* Add Messenger share */}
              <a href={`https://www.messenger.com/sharer.php?u=${currentCampaignUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon messenger">
                <i className="fa-brands fa-facebook-messenger fa-2x"></i>
              </a>
              {/* Add WhatsApp share */}
              <a href={`https://wa.me/?text=${currentCampaignUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                <i className="fa-brands fa-whatsapp fa-2x"></i>
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="container">
        <div className="row">
          {campaignData.map((campaign) => {
            const truncatedContent = sanitizeAndTruncateContent(campaign.content, 100);
            return (
              <div className="col-md-4 mb-4" key={campaign.id}>
                <div className="card">
                  <img
                    src={campaign && campaign.cover_image_url ? campaign.cover_image_url : ''}
                    alt={campaign?.title || 'Image Alt Text'}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h3 className="campaign-title">{campaign.title}</h3>
                    <p className="card-text">{truncatedContent}</p>
                  </div>
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <a href={`/campaigns/${campaign.id}`} className="btn btn-primary">
                      <i className="fa-brands fa-readme fa-flip fa-lg"></i>&nbsp;
                      Read More
                    </a>
                    <button
                      className="btn btn-success"
                      onClick={() => handleShare(campaign.id)}
                    >
                      <i className="fa-regular fa-share fa-beat-fade fa-lg"></i>&nbsp;
                      Share
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {copiedMessageVisible && (
          <div
            className="toast show"
            style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
          >
            <div className="toast-body bg-success text-white">
              URL copied to clipboard
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
          text-align: center;
        }

        .close {
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          color: red;
        }

        .url-container {
          padding: 10px;
          background-color: #28a745; /* Green color for success */
          border-radius: 5px;
        }

        .url-container p {
          word-break: break-all; /* Prevent URL overflow */
          margin: 0;
          color: white;
        }

        .social-icons-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
        }

        .social-icon {
          margin: 10px;
          font-size: 24px;
        }

        .social-icon.facebook {
          color: #1877f2; /* Facebook blue */
        }

        .social-icon.instagram {
          color: #e1306c; /* Instagram pink */
        }

        .social-icon.messenger {
          color: #0084ff; /* Messenger blue */
        }

        .social-icon.whatsapp {
          color: #25d366; /* WhatsApp green */
        }

        .social-icon:hover {
          opacity: 0.7;
        }

        .card {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .card-img-top {
          object-fit: cover;
          height: 200px; /* Adjust the height as needed */
        }

        .campaign-title {
          margin-bottom: 10px;
        }

        .card-text {
          flex-grow: 1;
          overflow-y: auto;
        }

        .btn {
          width: 100%;
        }

        .btn-success {
          background-color: #28a745; /* Green color for success */
          border-color: #28a745;
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;
