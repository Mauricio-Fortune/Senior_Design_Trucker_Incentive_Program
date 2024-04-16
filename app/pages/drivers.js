import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { fetchUserAttributes } from '@aws-amplify/auth';
import ResponsiveAppBar from '../Components/appbar';
import Application from './application';
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
  Button,
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
  const [org_Name, setOrgName] = useState([]);
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
  };

  // Function to handle registration button click
  const handleRegisterClick = (company) => {
    router.push('/application');
  };

  const getOrgNames = async () => {
    try {
        const requestOptions = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await fetch(`/api/driver/get_all_orgIDs_for_driver?user_ID=${user.sub}`, requestOptions);
        if (!response.ok) {
            throw new Error('Failed to fetch organization IDs');
        }
        const result = await response.json();
        setOrgName(result.org_Name); // Assuming result.org_IDs contains the IDs
    } catch (error) {
        console.error('Failed to fetch organization IDs:', error);
    }
};

useEffect(() => {
    async function currentAuthenticatedUser() {
        try {
            const user = await fetchUserAttributes(); // Assuming this correctly fetches the user
            setUser(user);
        } catch (err) {
            console.log(err);
        }
    }
    currentAuthenticatedUser();
}, []);

useEffect(() => {
    getOrgNames(); // Fetch organization names when user is available
}, [user]);

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
                {org_Name.map((org_Name, index) => (
                  <MenuItem key={index} value={org_Name}>{org_Name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedCompany && (
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {selectedCompany}
                  </Typography>
                  {driverData.map((driver) => {
                    if (driver.name === selectedCompany) {
                      return (
                        <div key={driver.id}>
                          <Typography>Points: {driver.points}</Typography>
                          <Typography>Goal: {driver.goal}</Typography>
                        </div>
                      );
                    }
                    return null;
                  })}
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