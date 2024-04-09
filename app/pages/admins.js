import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, Card, CardContent, Button, TextField, Box, CircularProgress, MenuItem, Snackbar } from '@mui/material';

function Admin() {
  const [sponsors, setSponsors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [newSponsorName, setNewSponsorName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);

  useEffect(() => {
    if (isDropdownClicked) {
      fetchSponsorOrgs();
    }
  }, [isDropdownClicked]);

  const fetchSponsorOrgs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/driver/get_all_avail_sponsor_companies');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data); // Add this line
      setSponsors(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccountsInSameOrg = async (orgName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/get-accounts-by-org-name?org_name=${orgName}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setSponsors(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    } finally {
      setIsLoading(false);
    }
  };  

  const handleOrgChange = (event) => {
    const selectedOrgName = event.target.value;
    setSelectedOrg(selectedOrgName);
    if (!isDropdownClicked) {
      setIsDropdownClicked(true);
    }
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
        <title>Admin</title>
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
          onChange={handleOrgChange}
        >
          {sponsors.map((sponsor, index) => (
            <MenuItem key={sponsor.id || index} value={sponsor.id || index}>
              {sponsor.name}
            </MenuItem>
          ))}
        </TextField>

        {selectedOrg && error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}

        {selectedOrg && (
          <React.Fragment>
            <Box mt={3} />

            <Typography variant="h4" gutterBottom>
              Sponsors
            </Typography>
            {sponsors.map((sponsor, index) => (
              <Card key={sponsor.id || index} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h6">{sponsor.name}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveSponsor(sponsor.id)}
                    style={{ marginTop: '8px' }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
            <TextField
              label="New Sponsor Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={newSponsorName}
              onChange={(e) => setNewSponsorName(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddSponsor}>
              Add Sponsor
            </Button>
          </React.Fragment>
        )}

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
        {error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
      </Container>
    </React.Fragment>
  );
}

export default Admin;
