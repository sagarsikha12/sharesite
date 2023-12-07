import React, { useEffect, useState,Link} from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const MyCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const apiConfig = {
      baseURL: `${apiUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    axios.get('/mycampaign', apiConfig)
      .then(response => {
        setCampaigns(response.data);
        setLoading(false);
 
      })
      .catch(error => {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
      });
  }, []);

  const handleEditCampaign = (id) => {
    router.push(`/campaigns/${id}/edit`);
  };

  const handleDeleteCampaign = async (id) => {
    const token = sessionStorage.getItem('token');
    const apiConfig = {
      baseURL: `${apiUrl}/api/v1`,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    };

    try {
      const response = await axios.delete(`/campaigns/${id}`, apiConfig);

      if (response.status === 204) {
        setCampaigns(prevCampaigns => prevCampaigns.filter(campaign => campaign.id !== id));
      } else {
        console.error('Campaign deletion failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  return (
    <div>
      <h1>My Campaigns</h1>
      {loading ? (
        <p>Loading...</p>
      ) : campaigns.length === 0 ? (
        <div>
          <p>You have not created any campaign.</p>
          <p>
       
               Create New Campaign and come back.
             
          
          </p>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.id}</td>
                <td>{campaign.title}</td>
                <td>{campaign.approved.charAt(0).toUpperCase() + campaign.approved.slice(1)}</td>
                <td>
                  
                  <button className="btn btn-success mr-2" onClick={() => handleEditCampaign(campaign.id)}>Edit&nbsp;
                  <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                 
                  <button className="btn btn-danger" onClick={() => handleDeleteCampaign(campaign.id)}>Delete&nbsp;
                  <i className="fa-solid fa-trash"></i>
                  </button>
                 

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCampaignsPage;
