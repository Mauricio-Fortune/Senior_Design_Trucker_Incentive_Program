import React, { useState } from 'react';
import Head from 'next/head';
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
import Store from './store';
import Driver_Catalog from './catalog/driver_catalog';
import Driver_Cart from './catalog/driver_cart';
const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 16,
  },
  tabsContainer: {
    marginTop: 16,
    borderBottom: '1px solid #ddd',
  },
  companyCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function AdminDrivers() {
  const [value, setValue] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const classes = useStyles();
  const router = useRouter();
  const driverData = [
    { id: 1, name: 'Amazon', points: 120, goal: 500 },
    { id: 2, name: 'UPS', points: 200, goal: 600 },
    { id: 3, name: 'FedEx', points: 150, goal: 550 }
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Function to handle company selection
  const handleCompanySelect = (event) => {
    setSelectedCompany(event.target.value);
  };

  // Function to handle registration button click
  const handleRegisterClick = (company) => {
    switch (company) {
      case 'Amazon':
        router.push('/amazonApplication');
        break;
      case 'UPS':
        router.push('/upsApplication');
        break;
      case 'FedEx':
        router.push('/fedexApplication');
        break;
      default:
        break;
    }
  };

  // Function to handle assign button click
  const handleAssignClick = (company) => {
    // Add logic for handling assign button click
    console.log(`Assign button clicked for ${company}`);
  };

  return (
    <>
      <Head>
        <title>Admin Drivers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        {value === 0 && (
          <div>
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
                <MenuItem value="Amazon">Amazon</MenuItem>
                <MenuItem value="UPS">UPS</MenuItem>
                <MenuItem value="FedEx">FedEx</MenuItem>
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
    <Grid item xs={12}>
      <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
        Register
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardContent className={classes.companyCardContent}>
          <Typography variant="h5" component="h2">
            Amazon
          </Typography>
          <Button onClick={() => handleRegisterClick('Amazon')} variant="contained" color="primary">
            Register
          </Button>
          <Button onClick={() => handleAssignClick('Amazon')} variant="contained" color="secondary">
            Assign
          </Button>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardContent className={classes.companyCardContent}>
          <Typography variant="h5" component="h2">
            UPS
          </Typography>
          <Button onClick={() => handleRegisterClick('UPS')} variant="contained" color="primary">
            Register
          </Button>
          <Button onClick={() => handleAssignClick('UPS')} variant="contained" color="secondary">
            Assign
          </Button>
        </CardContent>
      </Card>
    </Grid>
    <Grid item xs={12} sm={6} md={4}>
      <Card className={classes.card}>
        <CardContent className={classes.companyCardContent}>
          <Typography variant="h5" component="h2">
            FedEx
          </Typography>
          <Button onClick={() => handleRegisterClick('FedEx')} variant="contained" color="primary">
            Register
          </Button>
          <Button onClick={() => handleAssignClick('FedEx')} variant="contained" color="secondary">
            Assign
          </Button>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
)}

      </Container>
      {value === 2 && (
        <Driver_Catalog />
      )}
    </>
  );
}
