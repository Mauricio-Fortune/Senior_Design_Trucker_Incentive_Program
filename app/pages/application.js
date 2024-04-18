import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Container, Typography, TextField, Button, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { fetchUserAttributes } from '@aws-amplify/auth';

export default function Application() {
  const [company, setCompany] = useState('');
  const [user, setUser] = useState();
  const [org_Name, setOrgName] = useState('');
  const [org_Names, setOrgNotNames] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [org_ID, setOrgID] = useState('');
  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const getOrgNotNames = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (!user) return;
      const response = await fetch(`/api/driver/get_org_names_not_member?user_ID=${user}`, requestOptions);
      if (!response.ok) {
        console.log(response.body);
        throw new Error('Failed to fetch organization names');
      }
      const result = await response.json();
      console.log(result)
      setOrgNotNames(result); // Assuming result.org_IDs contains the IDs
    } catch (error) {
      console.error('Failed to fetch organization names:', error);
    }
  };

  const getOrgID = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
      if (!user) return;
      const response = await fetch(`/api/driver/get_orgID_using_name?org_Name=${org_Name}`, requestOptions);
      if (!response.ok) {
        console.log(response.body);
        throw new Error('Failed to fetch organization ID');
      }
      const result = await response.json();
      console.log(result)
      setOrgID(result); // Assuming result.org_IDs contains the IDs
    } catch (error) {
      console.error('Failed to fetch organization ID:', error);
    }
  };

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes();
        setUser(user.sub);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);

  useEffect(() => {
    if (user) {
      getOrgNotNames(); // Fetch organization names when user is available
    }
  }, [user]);

  useEffect(() => {
    getOrgID();
  }, [org_Name]);

  /*useEffect(() => {
    if(submitted) {
      window.location.reload();
    }
  }, [submitted]);*/

  const handleCompanyChange = (event) => {
    setCompany(event.target.value);
    const { company, value } = event.target;
    setOrgName(event.target.value);
  };

  const handleChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if all fields are filled in
    if (!company || !name || !email || !phoneNumber || !reason) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (!user) return;
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      };
      const response = await fetch(`/api/driver/post_send_app_to_sponsor?user_ID=${user}&org_ID=${org_ID}&reason=${reason}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to send app to sponsor');
      }

      setSubmitted(response);
    } catch (error) {
      console.error('Failed to send app to sponsor:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Driver Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
                {org_Names && org_Names.map((org, index) => (
                  <MenuItem key={index} value={org}>{org}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              variant="outlined"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            <TextField
              name="reasonToJoin"
              label="Why do you want to join our program?"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              margin="normal"
              value={reason}
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
    </>
  );
}
