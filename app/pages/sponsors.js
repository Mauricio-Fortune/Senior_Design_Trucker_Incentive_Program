// pages/sponsors.js
import React, { useState, useEffect} from 'react';
import Head from 'next/head';
import ProtectedLayout from '@/Components/ProtectedLayout';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
} from '@mui/material';

import AddItemCatalog from "./catalog/org_catalog_add"
import ManageCatalog from "./catalog/org_catalog_manager"
import { fetchUserAttributes } from '@aws-amplify/auth';

export default function Sponsors({ isSpoofing, sponsorSpoofID = '' }) {
  const [value, setValue] = useState(0);
  const [catalogValue, setCatalogValue] = useState(0);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPoints, setNewDriverPoints] = useState('');
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState(0);
  const [applications, setApplications] = useState([
    {
      id: 1,
      userID: '',
      name: '',
      email: '',
      reason: '',
      timestamp: ''
    }
  ]);


  useEffect(() => {


    const fetchAppData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const response = await fetch(`/api/sponsor/get_pending_applications?org_ID=${orgID}`, requestOptions);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();

        const updatedApplications = result.map(app => ({
          id: app.driver_app_id, 
          userID: app.user_ID,
          name: app.first_Name, 
          email: app.email,
          reason: app.reason,
          timestamp: app.timestamp,
          
        }));
  
        setApplications(updatedApplications);
      
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }

    };

    fetchAppData()
  }, [orgID]);

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes(); // Assuming this correctly fetches the user
        setUser(user); // Once the user is set, it triggers the useEffect for getDriverPoints
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);


  useEffect(() => {
    const getOrgID = async () => { // fetches all itemIDs in database
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
        console.log("USER " + user.sub);
        const response = await fetch(`/api/driver/get_current_sponsor?user_ID=${user.sub}`, requestOptions);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        
        setOrgID(result.org_ID);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setOrgID([]);
      }
    };
    if (user) {
      (async () => {
        const orgID = await getOrgID();
        if (orgID != null) {
          setOrgID(orgID);
        }
      })();
    }

  
  }, [user]); // Depend on user state
  


  

  const handleCatalogChange = (event, newValue) => {
    setCatalogValue(newValue);
  };

  const [mockDriverData, setMockDriverData] = useState([
    { id: 1, name: 'John Doe', points: 150 },
    { id: 2, name: 'Jane Smith', points: 120 },
    { id: 3, name: 'Bob Johnson', points: 90 },
  ]);

  const mockStoreItems = [
    { id: 1, name: 'Product 1', price: 20 },
    { id: 2, name: 'Product 2', price: 30 },
    { id: 3, name: 'Product 3', price: 15 },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleManagePoints = (driverId) => {
    // Implement logic to manage points for the selected driver
    console.log(`Managing points for driver with ID: ${driverId}`);
  };

  const handleRemoveDriver = (driverId) => {
    // Implement logic to remove the selected driver
    setMockDriverData((prevData) => prevData.filter((driver) => driver.id !== driverId));
    console.log(`Removing driver with ID: ${driverId}`);
  };

  const handleAddDriver = () => {
    // Implement logic to add a new driver
    const newDriver = {
      id: mockDriverData.length + 1,
      name: newDriverName,
      points: parseInt(newDriverPoints, 10) || 0,
    };

    setMockDriverData((prevData) => [...prevData, newDriver]);
    setNewDriverName('');
    setNewDriverPoints('');
  };

  const handleAcceptApplication = (application) => {
    // Implement logic to accept the driver application
    console.log(`Accepting ${application.name}'s application`);
    // Add the accepted driver to the sponsored drivers
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_ID : application.userID,
        org_ID : orgID,
        driver_app_id: application.id
      })
    };
   
    fetch('api/sponsor/post_accept_driver', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

   // const acceptedDriver = applications.find((app) => app.id === applicationId);
    
   // window.location.reload();
  };

  const handleDenyApplication = (application) => {
    
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_ID : application.userID,
        org_ID : orgID,
        driver_app_id: application.id
      })
    };
   
    fetch('api/sponsor/post_reject_driver', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Head>
        <title>Sponsors</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Dashboard" />
          <Tab label="Applications" />
          <Tab label="Catalog" />
        </Tabs>
      </Box>

      <Container>
        {value === 0 && (
          <div>
            <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
              Sponsor Dashboard
            </Typography>
            <Typography variant="h4" gutterBottom>
              Sponsored Drivers
            </Typography>
            {mockDriverData.map((driver) => (
              <Card key={driver.id} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h6">{driver.name}</Typography>
                  <Typography variant="body1">Points: {driver.points}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManagePoints(driver.id)}
                    style={{ marginRight: '8px' }}
                  >
                    Manage Points
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveDriver(driver.id)}
                  >
                    Remove Driver
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Form for adding new driver */}
            <Typography variant="h4" gutterBottom style={{ marginTop: '16px' }}>
              Add Sponsored Driver
            </Typography>
            <form>
              <TextField
                label="Driver Name"
                variant="outlined"
                fullWidth
                value={newDriverName}
                onChange={(e) => setNewDriverName(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <TextField
                label="Points"
                variant="outlined"
                fullWidth
                value={newDriverPoints}
                onChange={(e) => setNewDriverPoints(e.target.value)}
                style={{ marginBottom: '16px' }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDriver}
              >
                Add Driver
              </Button>
            </form>
          </div>
        )}

        {value === 1 && (
          <div>
            <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
              Driver Applications
            </Typography>
            {applications.map((application) => (
              <Card key={application.id} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h6">{application.name}</Typography>
                  <Typography variant="body1">Email: {application.email}</Typography>
                  <Typography variant="body1">Reason: {application.reason}</Typography>
                  <Typography variant="body1">Time Stamp: {application.timestamp}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptApplication(application)}
                    style={{ marginRight: '8px', marginTop: '8px' }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDenyApplication(application)}
                    style={{ marginTop: '8px' }}
                  >
                    Deny
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {value === 2 && (
          <>
            <Tabs value={catalogValue} onChange={handleCatalogChange} aria-label="catalog tabs">
              <Tab label="Add Items" />
              <Tab label="Manage Items" />
            </Tabs>

            {/* Tab Panels */}
            {catalogValue === 0 && (
              <AddItemCatalog isSpoof={isSpoofing} spoofId={sponsorSpoofID} />
            )}
            {catalogValue === 1 && (
              <ManageCatalog isSpoof={isSpoofing} spoofId={sponsorSpoofID} />
            )}
          </>
        )}



      </Container>
    </>
  );
}
