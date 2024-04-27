import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { fetchUserAttributes } from '@aws-amplify/auth';
import Application from '../Components/application';
import Driver_Catalog from '../Components/catalog/driver_catalog';
import Driver_Cart from '../Components/catalog/driver_cart';
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
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useRouter } from 'next/router';

import OrderManager from "../Components/driver_orders_manager"

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

export default function Drivers({isSpoofing = false, driverSpoofID = ''}) {
  const [user, setUser] = useState();
  const [org_ID, setOrgID] = useState();
  const [current_Org, setCurrent_Org] = useState();
  const [org_Name, setOrgName] = useState();
  const [org_Names, setOrgNames] = useState([]);
  const [point_changes, setPointChanges] = useState([]);
  const [value, setValue] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState('');
  const classes = useStyles();
  const router = useRouter();
  const [catalogValue, setCatalogValue] = useState(0);
  const [orders, setOrders] = useState([]);

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
  };

  // Function to handle registration button click
  const handleRegisterClick = (company) => {
    router.push('/application');
  };

useEffect(() => {
  async function currentAuthenticatedUser() {
    if (isSpoofing) {
      setUser(driverSpoofID);
      console.log("spoof id for driver: ", driverSpoofID);
    }
    else {
      try {
        const user = await fetchUserAttributes();
        setUser(user.sub);
      } catch (err) {
        console.log(err);
      }
    }
  }
  currentAuthenticatedUser();
}, []);

useEffect(() => {
  if (user) {
    getOrgNames(); // Fetch organization names when user is available
    getOrders();
  }
}, [user]);

useEffect(() => {
  getOrgID();
}, [org_Name]);

useEffect(() => {
  setCurrentOrg();
}, [org_ID]);

useEffect(() => {
  getPointChanges();
}, [current_Org]);

const getOrders = async () => {
  try {
    if (!user) return;

    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const response = await fetch(`/api/catalog/get_orders_for_driver?user_ID=${user}`, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to get orders');
    }
    const result = await response.json();
    setOrders(result); // Set "result" as the orders state
  } catch (error) {
    console.error('Failed to fetch orders:', error);
  }
};

const getPointChanges = async () => {
  try {
    if (!user) return;

    const requestOptions = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const response = await fetch(`/api/driver/get_all_point_changes?user_ID=${user}&org_ID=${org_ID}`, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to get point changes');
    }
    const result = await response.json();
    const rows = result.rows; // Access the "rows" property of the result object
    setPointChanges(rows); // Set "rows" as the point_changes state
  } catch (error) {
    console.error('Failed to fetch point changes:', error);
  }
};

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
    const result = await response.json();
    setCurrent_Org(result);
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
    setOrgID(result); // Assuming result.org_IDs contains the IDs
  } catch (error) {
    console.error('Failed to fetch organization ID:', error);
  }
};

const getOrgNames = async () => {
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
    {selectedCompany && point_changes && (
        <>
          {point_changes.map((pointSet, index) => (
            <Card key={index} className={classes.card}>
              <CardContent>
                {Object.entries(pointSet).map(([key, value]) => (
                  <div key={key} className={classes.pointChange}>
                    <Typography variant="subtitle1" gutterBottom>
                      {key}:
                    </Typography>
                    {Array.isArray(value) ? (
                      <List>
                        {value.map((change, changeIndex) => (
                          <ListItem key={changeIndex} disablePadding>
                            <ListItemText
                              primary={`Point Change Value: ${change.point_change_value}`}
                              secondary={`Reason: ${change.reason} | Timestamp: ${change.timestamp}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography>{value}</Typography>
                    )}
                    <Divider />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </>
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
              <Tab label="Your Orders" />
            </Tabs>

            {org_ID && (  // Check if org_ID is not null
              <div>
                {catalogValue === 0 && <Driver_Catalog isSpoof={isSpoofing} spoofId={driverSpoofID}/>}
                {catalogValue === 1 && <Driver_Cart isSpoof={isSpoofing} spoofId={driverSpoofID}/>}
              </div>
            )}
 
     {catalogValue === 2 && (
            <OrderManager isSpoof={isSpoofing} spoofId={driverSpoofID} />
        )}
          </>

        )}
      </Container>


    </>
  );
}

/*
   {catalogValue === 2 && orders && (
      <div className="order-list">
        {Object.entries(orders).map(([orderID, items]) => (
          <Card key={orderID} className="order-card" sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h5" component="h2">
                Order ID: {orderID}
              </Typography>
              {items.map((item, index) => (
                <div key={index}>
                  <Typography variant="body1" component="p" sx={{ marginLeft: '16px' }}>
                    Item: {item.itemName}
                  </Typography>
                  <Typography variant="body1" component="p" sx={{ marginLeft: '16px' }}>
                    Quantity: {item.itemQuantity}
                  </Typography>
                  {index < items.length - 1 && <Divider sx={{ marginTop: '8px', marginBottom: '8px' }} />}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    )}

*/