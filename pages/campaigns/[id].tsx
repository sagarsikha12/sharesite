import { useEffect, useState, CSSProperties } from 'react';
import { useRouter } from 'next/router';
import { Campaign } from '../../types/types';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CampaignDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [campaign, setCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    async function fetchCampaignData() {
      try {
        const response = await fetch(`${apiUrl}/campaigns/${id}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setCampaign(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    }

    if (id) {
      fetchCampaignData();
    }
  }, [id]);

  const styles: Record<string, CSSProperties> = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
    },
    campaign: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    title: {
      fontWeight: 'bold',
      fontSize: '24px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    image: {
      maxWidth: '100%',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
    },
    content: {
      fontSize: '16px',
      lineHeight: '1.5',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      {campaign && (
        <div style={styles.campaign}>
          <h1 style={styles.title}>{campaign.title}</h1>
  
            <img
            src={campaign && campaign.cover_image_url ? campaign.cover_image_url : ''}
            alt={campaign?.title || 'Image Alt Text'}
            style={styles.image}
          />
          
    
          
          <div 
            style={styles.content} 
            dangerouslySetInnerHTML={{ __html: campaign.content }} 
          />
        </div>
      )}
    </div>
  );
};

export default CampaignDetailPage;
