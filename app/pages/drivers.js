import React, { useState } from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../Components/appbar';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import { styled } from '@mui/system'; // Import styled from @mui/system instead of makeStyles
import { useRouter } from 'next/router';
import Store from './store';
import Driver_Catalog from './catalog/driver_catalog';
import ProtectedLayout from '@/Components/ProtectedLayout';

// Use the styled utility function to create a styled component
const StyledCard = styled(Card)({
  marginBottom: 16,
});

export default function Drivers() {
  const [value, setValue] = useState(0);
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample driver data (replace with actual data)
  const driverData = [
    { id: 1, name: 'Driver 1', points: 120, goal: 500 }
  ];

  return (
    <>
      <Head>
        <title>Drivers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProtectedLayout>
        {/* Box for Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Dashboard" />
          <Tab label="Store" />
        </Tabs>
        </Box>

        <Container>
        {/* Tab Content */}
        {value === 0 && (
          <div>
            {/* Dashboard */}
            <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
              Dashboard
            </Typography>
            {driverData.map((driver) => (
              <StyledCard key={driver.id}>
                <CardContent>
                  <Typography variant="h6">{driver.name}</Typography>
                  <Typography>Points: {driver.points}</Typography>
                  <Typography>
                    Points until Goal: {driver.goal - driver.points}
                  </Typography>
                </CardContent>
              </StyledCard>
            ))}
            {/* Other Drivers */}
          <Typography variant="h4" gutterBottom>
            Other Drivers
          </Typography>
          <Grid container spacing={2}>
            {driverData.map((driver) => (
              <Grid item key={driver.id} xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6">{driver.name}</Typography>
                    <Typography>Points: {driver.points}</Typography>
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
          </div>
        )}
        </Container>
        {/*Store page works better outside container*/}
        {value === 1 && (
            <Driver_Catalog />
        )}
      </ProtectedLayout>
      </>
        
  );
}
