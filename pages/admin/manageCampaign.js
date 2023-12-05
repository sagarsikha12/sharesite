import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import withAdminAuth from '../withAdminAuth';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const CampaignList = () => {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [filter, setFilter] = useState('all'); // Default filter is 'all'
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [, updateState] = useState(); // Create a state variable for triggering updates
  const router = useRouter();
  const forceUpdate = () => updateState({});

  const updateCampaignList = (updatedCampaigns) => {
    setCampaigns(updatedCampaigns);
    setTotalCampaigns(updatedCampaigns.length);
    const filtered = updatedCampaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(search.toLowerCase()) &&
      (filter === 'all' || campaign.approved === filter)
    );
    setFilteredCampaigns(filtered);
  };

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const token = sessionStorage.getItem('token');

    if (token) {
      // Fetch campaign data using your API
      const apiConfig = {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      axios.get('/campaigns/listall', apiConfig)
        .then(response => {
          
          const campaignData = response.data;

          if (Array.isArray(campaignData)) {
            setCampaigns(campaignData);
            setTotalCampaigns(campaignData.length);
            const filtered = campaignData.filter((campaign) =>
              campaign.title.toLowerCase().includes(search.toLowerCase()) &&
              (filter === 'all' || campaign.approved === filter)
            );
            setFilteredCampaigns(filtered);
          } else {
            console.error('Invalid campaign data:', campaignData);
          }

          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
          console.error('Error fetching campaigns:', error);
        });
    }else{
      router.push('/login');
    }
  }, [router,search, filter]); // Include filter in dependencies

  const updateCampaignListAfterAction = async (campaignId, newStatus) => {
    try {
      // Make an API request to get the updated campaign data
      const token = sessionStorage.getItem('token');
      const response = await axios.get(`/campaigns`, {
        baseURL: `${apiUrl}/api/v1`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Update the campaign in the state
      const updatedCampaign = response.data;
      setCampaigns((prevCampaigns) =>
        prevCampaigns.map((campaign) =>
          campaign.id === campaignId ? { ...campaign, approved: updatedCampaign.approved } : campaign
        )
      );
      setSuccessMessage(`Campaign ${newStatus} successfully!`);
      setTimeout(() => setSuccessMessage(''), 3000); // Clear the message after 3 seconds

      // Trigger a component update
      forceUpdate();

      // Refresh the page
      window.location.reload();
    } catch (error) {
      setErrorMessage(`Error updating the campaign: ${error.message}`);
    }
  };

  const approveCampaign = async (campaignId) => {
    try {
      const token = sessionStorage.getItem('token');
      await axios.patch(`${apiUrl}/admin/campaigns/${campaignId}/approve`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the campaign in the state
      updateCampaignListAfterAction(campaignId, 'approved');
    } catch (error) {
      setErrorMessage(`Error approving the campaign: ${error.message}`);
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

      // Update the campaign in the state
      updateCampaignListAfterAction(campaignId, 'rejected');
    } catch (error) {
      setErrorMessage(`Error rejecting the campaign: ${error.message}`);
    }
  };

  const handleDeleteCampaign = (campaignId) => {
    const confirmed = window.confirm('Are you sure you want to delete this campaign?');
    if (confirmed) {
      // Make an API request to delete the campaign by campaignId
      const token = sessionStorage.getItem('token');
      if (token) {
        const apiConfig = {
          baseURL: `${apiUrl}/api/v1`,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        };

        axios.delete(`/campaigns/${campaignId}`, apiConfig)
          .then(response => {
            // Handle success
            updateCampaignList(campaigns.filter(campaign => campaign.id !== campaignId));
            setSuccessMessage(`Campaign with ID ${campaignId} has been deleted.`);
            setErrorMessage('');

            // Refresh the page
            window.location.reload();
          })
          .catch(error => {
            // Handle error
            console.error(`Error deleting campaign with ID ${campaignId}:`, error);
            setSuccessMessage('');
            setErrorMessage(`Error deleting campaign with ID ${campaignId}: ${error.message}`);
          });
      }
    }
  };

  return (
    <div>
      <h1 className="text-center">Campaign List</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <p>Total Campaigns: {totalCampaigns}</p>
          <div className="filter">
            Filter by Status:{' '}
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search campaigns by Title"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
          />
          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.id}</td>
                  <td>{campaign.title}</td>
                  <td>{campaign.approved}</td>
                  <td>
                    {campaign.approved === 'pending' ? (
                      <>
                        <button
                          className="btn btn-success"
                          onClick={() => approveCampaign(campaign.id)}
                        >
                          Accept
                         &nbsp;
              
              <i class="fa-solid fa-check"></i>
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => rejectCampaign(campaign.id)}
                        >
                          Reject
                          &nbsp;
              <i class="fa-solid fa-ban"></i>
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteCampaign(campaign.id)}
                      >                       
                        Delete&nbsp;
                          <i className="fa-solid fa-trash "></i>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default withAdminAuth(CampaignList);
