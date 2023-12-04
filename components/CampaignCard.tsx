import React from 'react';
import Link from 'next/link';

interface CampaignCardProps {
  title: string;
  content: string;
  cover_image_url: string | null; // Use the correct prop name
  id: number; // Assuming you have an id as a unique identifier
}
const CampaignCard: React.FC<CampaignCardProps> = ({ title, content, cover_image_url, id }) => {
  // Define the maximum length for the content snippet
  const snippetLength = 100;


  // Truncate the content if it exceeds the snippet length
  const snippet = content.length > snippetLength 
    ? content.substring(0, snippetLength) + '...' 
    : content;

  return (
    <div className="campaign-card">
      <div>
        {cover_image_url && (
          <Link href={`/campaigns/${id}.json`}>
            <img src={cover_image_url} alt={title} />
          </Link>
        )}
      </div>
      <div>
        <Link href={`/campaigns/${id}`}>
          <h2>{title}</h2>
        </Link>
        <div>
          {snippet}
          {content.length > snippetLength && (
            <div>
              <Link href={`/campaigns/${id}`}>Read more..</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
