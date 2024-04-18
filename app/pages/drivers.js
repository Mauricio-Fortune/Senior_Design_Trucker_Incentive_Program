import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { fetchUserAttributes } from '@aws-amplify/auth';
import Application from './application';
import Driver_Catalog from './catalog/driver_catalog';
import Driver_Cart from './catalog/driver_cart';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Box,
  MenuItem,
  FormControl,
  Select,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 16,
  },
  tabsContainer: {
    marginTop: 16,
    borderBottom: '1px solid #ddd', // Optional: Add a border between tabs and content
  },
  companyCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function Drivers() {
  const [user, setUser] = useState();
  const [org_ID, setOrgID] = useState();
  const [org_Name, setOrgName] = useState();
  const [org_Names, setOrgNames] = useState([]);
  const [value, setValue] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const classes = useStyles();
  const router = useRouter();
  const [catalogValue, setCatalogValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleCatalogChange = (event, newValue) => {
    setCatalogValue(newValue);
  };

  // Function to handle company selection
  const handleCompanySelect = (event) => {
    setSelectedCompany(event.target.value);
    setOrgName(event.target.value);
    setOrgName(event.target.value);
  };

  // Function to handle registration button click
  const handleRegisterClick = (company) => {
    router.push('/application');
  };
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
  if (user) {
    getOrgNames(); // Fetch organization names when user is available
  }
  }
}, [user]);

useEffect(() => {
  getOrgID();
}, [org_Name]);

useEffect(() => {
  setCurrentOrg();
}, [org_ID]);

const setCurrentOrg = async () => {
  try {
    if (!user) return;

    const requestOptions = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({}) // Include an empty object in the request body
    };

    // Make the API call to update the current organization
    const response = await fetch(`/api/driver/set_current_org?org_ID=${org_ID}&user_ID=${user}`, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to set current org');
    }

  } catch (error) {
    console.error('Failed to update organization:', error);
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

const getOrgNames = async () => {
  console.log(user);
  try {
    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (!user) return; // Check if user is available
    const response = await fetch(`/api/driver/get_all_orgIDs_for_driver?user_ID=${user}`, requestOptions);
    if (!response.ok) {
      console.log(response.body);
      throw new Error('Failed to fetch organization names');
    }
    const result = await response.json();
    console.log(result)
    setOrgNames(result); // Assuming result.org_IDs contains the IDs
  } catch (error) {
    console.error('Failed to fetch organization names:', error);
  }
};

  return (
    <>
      <Head>
        <title>Drivers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Box for Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Dashboard" />
          <Tab label="Register" />
          <Tab label="Store" />
        </Tabs>
      </Box>

      <Container>
        {/* Tab Content */}
        {value === 0 && (
  <div>
    {/* Dashboard */}
    <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
      Driver Dashboard
    </Typography>
    <FormControl style={{ marginBottom: '16px' }}>
    <Select
  value={selectedCompany}
  onChange={handleCompanySelect}
  displayEmpty
>
  <MenuItem value="" disabled>Select Company</MenuItem>
  {org_Names && org_Names.map((org, index) => (
    <MenuItem key={index} value={org}>{org}</MenuItem>
  ))}
</Select>
    </FormControl>
    {selectedCompany && (
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {selectedCompany}
          </Typography>
        </CardContent>
      </Card>
    )}
  </div>
)}
      {value === 1 && (
        <Grid container spacing={3}>
          {/* Register */}
          <Grid item xs={12}>
            <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
              Register
            </Typography>
          </Grid>
          <Application />
        </Grid>
      )}
      </Container>
      <Container>
        {/* Store page works better outside container */}
        {value === 2 && (
          <>
            <Tabs value={catalogValue} onChange={handleCatalogChange} aria-label="catalog tabs">
              <Tab label="Store" />
              <Tab label="Your Cart" />
            </Tabs>

            {/* Tab Panels */}
            {catalogValue === 0 && (
              <Driver_Catalog />
            )}
            {catalogValue === 1 && (
              <Driver_Cart />
            )}
          </>

        )}
      </Container>

    </>
  );
}