import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { Campaign } from '../../types/types'; // Adjust the import path for your types

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CampaignsPage = () => {
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
                    <div
                      dangerouslySetInnerHTML={{ __html: snippet }}
                      className="card-text"
                    />
                  </div>
                  <div className="card-footer">
                    <a href={`/campaigns/${campaign.id}`} className="btn btn-primary">
                      Read More
                    </a>
                    <button
                      className="btn btn-success ml-2"
                      onClick={(e) => {
                        e.preventDefault();
                        copyToClipboard(window.location.href + `/${campaign.id}`);
                      }}
                    >
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
