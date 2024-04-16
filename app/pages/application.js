import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../Components/appbar';
import { Container, Typography, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import ProtectedLayout from '@/Components/ProtectedLayout';

export default function Application() {
  const [company, setCompany] = useState('');
  const [user, setUser] = useState();
  const [org_Name, setOrgNotNames] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phoneNumber: '',
    reasonToJoin: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const getOrgNotNames = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(`/api/driver/get_org_names_not_member?user_ID=${user.sub}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to fetch organization IDs');
      }
      const result = await response.json();
      setOrgNotNames(result.org_Name);
    } catch (error) {
      console.error('Failed to fetch organization IDs:', error);
    }
  };

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes();
        setUser(user);
        getOrgIDs();
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);

  useEffect(() => {
    getOrgNotNames();
  }, [user]);

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    const { company, value } = event.target;
    setFormData({ ...formData, [company]: value });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Perform any additional validation here if needed
      console.log('Form data:', formData);
      // Example: Sending form data to an API endpoint
      const response = await fetch('/api/driver/post_send_app_to_sponsor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Driver Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProtectedLayout>
        <Container>
          <Box mt={4}>
            <Typography variant="h3" gutterBottom>
              Driver Application
            </Typography>
          </Box>
          {submitted ? (
            <Typography variant="h4" gutterBottom>
              Thank you for applying!
            </Typography>
          ) : (
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="company-select-label">Select Company</InputLabel>
                <Select
                  labelId="company-select-label"
                  id="company-select"
                  value={company}
                  onChange={handleCompanyChange}
                  label="Select Company"
                >
                  <MenuItem value="" disabled>Select Company</MenuItem>
                  {org_Name.map((org_Name, index) => (
                    <MenuItem key={index} value={org_Name}>{org_Name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                name="name"
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <TextField
                name="reasonToJoin"
                label="Why do you want to join our program?"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.reasonToJoin}
                onChange={handleChange}
              />
              <Box mt={2}>
                <Button type="submit" variant="contained" color="primary">
                  Submit Application
                </Button>
              </Box>
            </form>
          )}
          <Box mt={2} />
        </Container>
      </ProtectedLayout>
    </>
  );
}
