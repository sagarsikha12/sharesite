import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Campaign } from '../../types/types'; // Adjust the import path for your types

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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

  const snippetLength = 100;

  return (
    <div>
      <Head>
        <title>Campaigns</title>
      </Head>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <span  className=" close close-button" onClick={() => setShowModal(false)}>
            &times;
            </span>
            <br/>
            <p className='alert alert-success'>{currentCampaignUrl}</p>
            <button className='btn btn-info' onClick={() => copyToClipboard(currentCampaignUrl)}>
            <i className ="fa-regular fa-copy fa-bounce fa-xl"></i>
            Copy
            </button>
            
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${currentCampaignUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon">
           
        
            <i className="fa-brands fa-square-facebook fa-beat-fade fa-2xl"></i>
             
          
            </a>
          
          </div>
        </div>
      )}
      <div className="container">
        <div className="row">
          {campaignData.map((campaign) => {
            const snippet = campaign.content.length > snippetLength
              ? campaign.content.substring(0, snippetLength) + '...'
              : campaign.content;

            return (
              <div className="col-md-4 mb-4" key={campaign.id}>
                <div className="card d-flex flex-column">
                  <div className="image-container">
                    <img
                      src={campaign && campaign.cover_image_url ? campaign.cover_image_url : ''}
                      alt={campaign?.title || 'Image Alt Text'}
                      className="card-img"
                    />
                  </div>
                  <div className="card-body flex-grow-1">
                  <h3 className="campaign-title">{campaign.title}</h3> {/* Title added here */}
                    <div
                      dangerouslySetInnerHTML={{ __html: snippet }}
                      className="card-text"
                    />
                  </div>
                  <div className="card-footer">
                    <a href={`/campaigns/${campaign.id}`} className="btn btn-primary">
                    <i className="fa-brands fa-readme fa-flip fa-lg" ></i>&nbsp;
                      Read More
                    </a>
                    <button
                      className="btn btn-success ml-2"
                      onClick={()=> handleShare(campaign.id)}
                      // onClick={(e) => {
                      //   e.preventDefault();
                        
                      //   copyToClipboard(window.location.href + `/${campaign.id}`);
                      // }}
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
      .social-icon {
        margin: 10px;
        color: #4267B2; // Facebook color
        cursor: pointer;
      }
    
      .social-icon:hover {
        color: darken(#4267B2, 10%);
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color:transparent;
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

      .close:hover {
        color: red;
      }
      
      .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 50%;
        text-align: center;
      }
      .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
      }
      .close:hover, .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
      }
        .image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .card {
          display: flex;
          flex-direction: column;
          height: 400px;
        }

        .card-body {
          flex-grow: 1;
          overflow-y: auto;
        }

        .card-footer {
          padding: 10px;
        }

        .card-img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
    </div>
  );
};

export default CampaignsPage;
