import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const AdminCampaigns = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchNonReviewedCampaigns() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get( `${apiUrl}/admin/campaigns`,{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
       
        setCampaigns(response.data);
      
      } catch (error) {
        console.error("Error fetching non-reviewed campaigns:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNonReviewedCampaigns();
  }, []);

  const approveCampaign = async (campaignId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.patch(`${apiUrl}/admin/campaigns/${campaignId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== campaignId));
      setSuccessMsg("Campaign approved successfully!");
      setTimeout(() => setSuccessMsg(""), 3000); // Clear the message after 3 seconds
    } catch (error) {
      console.error("Error approving the campaign:", error);
    }
  };
  const rejectCampaign = async (campaignId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.patch(`${apiUrl}/admin/campaigns/${campaignId}/reject`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCampaigns(prevCampaigns => prevCampaigns.filter(c => c.id !== campaignId));
      setSuccessMsg("Campaign rejected successfully!");
      setTimeout(() => setSuccessMsg(""), 3000); // Clear the message after 3 seconds
    } catch (error) {
      console.error("Error approving the campaign:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Non-Reviewed Campaigns</h1>
      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {loading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) :campaigns.length > 0 ? (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Campaign Title</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.title}</td>
            <td className="d-flex">
              <button className="btn btn-primary me-2"  style={{ marginRight: '10px' }}onClick={() => approveCampaign(campaign.id)}>Approve&nbsp;
              
              <i class="fa-solid fa-check"></i></button>
             
              <button className="btn btn-danger" onClick={() => rejectCampaign(campaign.id)}>Reject&nbsp;
              <i class="fa-solid fa-ban"></i>
              </button>
            </td>
              </tr>
            ))}
          </tbody>
        </table>
      ): (
        <div>No campaigns to review.</div>
      )}
    </div>
  );
};

export default AdminCampaigns;
