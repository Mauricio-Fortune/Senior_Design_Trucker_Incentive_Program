import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Card, CardContent, Button, TextField, Box, CircularProgress, MenuItem, Snackbar } from '@mui/material';

function Admin() {
  const [sponsorOrgs, setSponsorOrgs] = useState([]);  
  const [sponsorUsers, setSponsorUsers] = useState([]);
  const [driverUsers, setDriverUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedOrgBool, setSelectOrgBool] = useState(false);
  const [newSponsorName, setNewSponsorName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  

  useEffect(() => {
    setIsLoading(true);
    fetchSponsorOrgs();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if(sponsorOrgs.length > 0){
      fetchSponsorsInSameOrg();
    }

  setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    setIsLoading(true);
    if(sponsorOrgs.length > 0){
      fetchDriversInSameOrg();
    }

  setIsLoading(false);
  }, [selectedOrg]);

  const fetchSponsorOrgs = async () => {
    try {
      const response = await fetch('/api/driver/get_all_avail_sponsor_companies');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      //console.log('API Response:', data); // Add this line
      setSponsorOrgs(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  };

  const fetchSponsorsInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get-accounts-by-org-name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'SPONSOR'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setSponsorUsers(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  }; 
  
  const fetchDriversInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get-accounts-by-org-name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'DRIVER'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setDriverUsers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to fetch drivers');
    }
  };  

  const handleOrgChange = (event) => {
    const selectedOrgIndex = event.target.value;
    setSelectedOrg(selectedOrgIndex);
    setSelectOrgBool(true);
  };

  const handleAddSponsor = async () => {
    try {
      const response = await fetch('/api/admin/add_org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org_Name: newSponsorName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add sponsor');
      }
      const data = await response.json();
      setSponsors([...sponsors, data]);
      setNewSponsorName('');
      setSuccessMessage('Sponsor added successfully');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      setError('Failed to add sponsor');
    }
  };

  const handleRemoveSponsor = async (sponsorId) => {
    try {
      const response = await fetch('/api/admin/delete_org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org_ID: sponsorId }),
      });
      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }
      setSponsors(sponsors.filter((sponsor) => sponsor.id !== sponsorId));
      setSuccessMessage('Sponsor removed successfully');
    } catch (error) {
      console.error('Error removing sponsor:', error);
      setError('Failed to remove sponsor');
    }
  };

  return (
    <React.Fragment>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>

        <Box mt={3} />

        <Typography variant="h4" gutterBottom>
          Select Organization
        </Typography>
        <TextField
          select
          label="Select Organization"
          variant="outlined"
          fullWidth
          margin="normal"
          value={selectedOrg}
          onChange={handleOrgChange} // Define this function to handle changes
        >
          {!isLoading && sponsorOrgs.map((sponsor, index) => (
            <MenuItem key={sponsor.org_Name} value={index}>
              {sponsor.org_Name}
            </MenuItem>
          ))}
        </TextField>

        {!selectedOrg && error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
        <Typography variant="h4" gutterBottom>
          Sponsors:
        </Typography>
        {selectedOrgBool && sponsorUsers.map((user) => (
          <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">ID: {user.user_Type}</Typography>
              <Typography variant="subtitle1">Name: {user.first_Name}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveUser(user.user_ID)}
                style={{ marginTop: '8px' }}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}

        <Typography variant="h4" gutterBottom>
          Drivers:
        </Typography>
        {selectedOrgBool && driverUsers.map((user) => (
          <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">ID: {user.user_Type}</Typography>
              <Typography variant="subtitle1">Name: {user.first_Name}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveUser(user.user_ID)}
                style={{ marginTop: '8px' }}
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}

        {/* Commented elements can be uncommented if you decide to use them */}
        {/* <TextField
          label="New Sponsor Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={newSponsorName}
          onChange={(e) => setNewSponsorName(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddSponsor}>
          Add Sponsor
        </Button> */}

        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}
        {!error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
      </Container>
    </React.Fragment>
  );
}

export default Admin;