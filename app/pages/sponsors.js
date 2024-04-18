// pages/sponsors.js
import React, { useState, useEffect} from 'react';
import Head from 'next/head';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import AddItemCatalog from "./catalog/org_catalog_add"
import ManageCatalog from "./catalog/org_catalog_manager"
import { fetchUserAttributes } from '@aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';


export default function Sponsors({ isSpoofing, sponsorSpoofID = '' }) {
  const [value, setValue] = useState(0);
  const [catalogValue, setCatalogValue] = useState(0);
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState(0);

  // for adding a new driver dialog
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState('');

// for changin points dialog
  const [pointDialogOpen, setPointDialogOpen] = useState(false);
  const [pointsChange, setPointsChange] = useState(0);
  const [currentDriverId, setCurrentDriverId] = useState(null);
  const [applications, setApplications] = useState([
    {
      id: 0,
      userID: '',
      name: '',
      email: '',
      reason: '',
      timestamp: ''
    }
  ]);

  const [userInfo, setUserInfo] = useState([
    {
      userID: '',
      userName: '',
      userEmail: '',
      points: 0
    }
  ])
  


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

    const fetchDriverData = async () => {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const response = await fetch(`/api/sponsor/get_driver_info?org_ID=${orgID}`, requestOptions);
  
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();

        const updatedUsers = result.map(app => ({
          userID: app.user_ID,
          userName: app.first_Name,
          userEmail: app.email,
          points: app.total_points
          
        }));
  
        setUserInfo(updatedUsers);
      
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }

    };

    fetchAppData()
    fetchDriverData()
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
  

  useEffect(() => {
    async function addNewUser(userId){
      try{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        
        const raw = JSON.stringify({
          "user_ID": userId,
          "org_ID": orgID,
          "email": email,
          "name": name
        });
        
        const requestOptions1 = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        
        fetch("/api/sponsor/post_add_driver", requestOptions1)
          .then((response) => response.text())
          .then((result) => console.log(result))
         .catch((error) => console.error(error));
        
        
      }catch(error){
        console.error('Error during sign up:', error);
      }
    }
    addNewUser(newUser);
  }, [newUser]); // Depend on user state
  


  const handleCatalogChange = (event, newValue) => {
    setCatalogValue(newValue);
  };


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const handleRemoveDriver = (driverId) => {
    // Implement logic to remove the selected driver
    const requestOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        user_ID : driverId,
        org_ID : orgID
      })
    };
   
    fetch('api/sponsor/post_remove_driver', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    console.log(`Removing driver with ID: ${driverId}`);
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
        org_ID : orgID
      })
    };
   
    fetch('api/sponsor/post_accept_driver', requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));

    
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

const handleManagePoints = (driverId) => {
    setCurrentDriverId(driverId);
    setPointsChange(0);  
    setPointDialogOpen(true);
};

const handleCloseDialog = () => {
  setPointDialogOpen(false);
};

const handleSubmit = () => {
    console.log(`Submitting points change: ${pointsChange} for driver ID: ${currentDriverId}`);
    const pointOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            user_ID : currentDriverId,
            point_change_value : pointsChange,
            reason: "Cause I said so", 
            org_ID: orgID,
            timestamp: "timestamp"
          })
        };
          fetch('/api/sponsor/edit_points', pointOptions);

    // Here, add your logic to update the points backend or state
    handleCloseDialog();
};


  const handleAddDriver = () => {
    setAppDialogOpen(true);
   
  };
  const handleAppCloseDialog = () => {
    setAppDialogOpen(false);
  };

  const handleAppSubmit = () => {
    const userType = 'driver';
    console.log(email);
    console.log(password);
    console.log(name);
    console.log(birthday);
    console.log(userType);


    async function handleSignUp(email, password, name, birthdate, userType) {
      try {
        
          const {isSignUpComplete, userId, nextStep } = await signUp({
              'username': email,
              'password': password,
              options: {
                userAttributes: {
                  'email': email,
                  'name': name,      
                  'birthdate': birthdate,  
                  'custom:user_type': userType,  
              },
              autoSignIn: false
              }
            
          });

          
          console.log(userId);
          setNewUser(userId);
   
      } catch (error) {
          console.error('Error during sign up:', error);
      }
  }
    handleSignUp(email,password,name,birthday,userType);
    
    setAppDialogOpen(false);
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
            {userInfo.map((driver) => (
              <Card key={driver.userID} style={{ marginBottom: '16px' }}>
                <CardContent>
                  <Typography variant="h5">{driver.userName}</Typography>
                  <Typography variant="body1">{driver.userEmail}</Typography>
                  <Typography variant="body1">Points: {driver.points}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleManagePoints(driver.userID)}
                    style={{ marginRight: '8px' }}
                  >
                    Manage Points
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemoveDriver(driver.userID)}
                  >
                    Remove Driver
                  </Button>
                </CardContent>
              </Card>
            ))}

                {/* Points Management Dialog */}
                <Dialog open={pointDialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Manage Points</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="points"
                            label="Change Points"
                            type="number"
                            fullWidth
                            value={pointsChange}
                            onChange={(e) => setPointsChange(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancel</Button>
                        <Button onClick={handleSubmit} color="primary">Submit</Button>
                    </DialogActions>
                </Dialog>

            {/* Form for adding new driver */}
            <Typography variant="h4" gutterBottom style={{ marginTop: '16px' }}>
              Add New Sponsored Driver
            </Typography>
            <form>
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
        {/* Points Management Dialog */}
        <Dialog 
        open={appDialogOpen} 
        onClose={handleAppCloseDialog}
        fullWidth={true}
        style={{ 
          padding: '8px 24px'
         }}
        >
                    <DialogTitle>Add a New Driver</DialogTitle>
                    <DialogContent>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Email"
                            label="Email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Name"
                            label="Name"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </DialogContent>            
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Birthday"
                            label="Birthday (yyyy-mm-dd)"
                            fullWidth
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                          <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Password"
                            label="Password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </DialogContent>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAppCloseDialog}>Cancel</Button>
                        <Button onClick={handleAppSubmit} color="primary">Submit</Button>
                    </DialogActions>
                </Dialog>

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


/*
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_ID": userId,
  "org_ID": orgID,
  "reason": "created by sponsor",
  "timestamp": "2024-04-12"
});

const requestOptions1 = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("/api/driver/post_send_app_to_sponsor", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));


  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "user_ID": userId,
  "org_ID": orgID,
  "driver_app_id": 2
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("/api/sponsor/post_accept_driver", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));

*/