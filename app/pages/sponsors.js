// pages/sponsors.js
import React, { useState } from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../styles/appbar';
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

export default function Sponsors() {
  const [value, setValue] = useState(0);
  const [catalogValue, setCatalogValue] = useState(0);
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPoints, setNewDriverPoints] = useState('');
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: 'Driver Applicant 1',
      email: 'applicant1@example.com',
      phoneNumber: '123-456-7890',
      reason: 'I am passionate about driving and want to contribute to the program.',
    },
    {
      id: 2,
      name: 'Driver Applicant 2',
      email: 'applicant2@example.com',
      phoneNumber: '987-654-3210',
      reason: 'I have previous experience as a professional driver and love the program goals.',
    },
  ]);

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

  const handleAcceptApplication = (applicationId) => {
    // Implement logic to accept the driver application
    console.log(`Accepting application with ID: ${applicationId}`);
    // Add the accepted driver to the sponsored drivers
    const acceptedDriver = applications.find((app) => app.id === applicationId);
    setMockDriverData((prevData) => [...prevData, { id: prevData.length + 1, name: acceptedDriver.name, points: 0 }]);
    // Remove the accepted application from the applications list
    setApplications((prevApps) => prevApps.filter((app) => app.id !== applicationId));
  };

  const handleDenyApplication = (applicationId) => {
    // Implement logic to deny the driver application
    setApplications((prevApps) => prevApps.filter((app) => app.id !== applicationId));
    console.log(`Denying application with ID: ${applicationId}`);
  };

  return (
    <>
      <Head>
        <title>Sponsors</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResponsiveAppBar />
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
              Dashboard
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
                  <Typography variant="body1">Phone Number: {application.phoneNumber}</Typography>
                  <Typography variant="body1">Reason: {application.reason}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptApplication(application.id)}
                    style={{ marginRight: '8px', marginTop: '8px' }}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDenyApplication(application.id)}
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
          <AddItemCatalog />
        )}
        {catalogValue === 1 && (
           <ManageCatalog />   
        )}
      </>
    )}


         
      </Container>
    </>
  );
}
