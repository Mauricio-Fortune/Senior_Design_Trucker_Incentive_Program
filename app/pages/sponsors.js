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
  MenuItem,
  Select,
  DialogTitle,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

import AddItemCatalog from "./catalog/org_catalog_add"
import ManageCatalog from "./catalog/org_catalog_manager"
import { fetchUserAttributes } from '@aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';
import { unstable_createStyleFunctionSx } from '@mui/system';


export default function Sponsors({isSpoofing = false, sponsorSpoofID = ''}) {
  const [value, setValue] = useState(0);
  const [catalogValue, setCatalogValue] = useState(0);
  const [reportValue, setReportValue] = useState(0);
  const [user, setUser] = useState();
  const [orgID,setOrgID] = useState(0);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pointChanges, setPointChanges] = useState([]);
  const [submitted, setSubmitted] = useState(0);
  const [submittedAudit, setSubmittedAudit] = useState(0);
  const [selectAllDrivers, setSelectAllDrivers] = useState(false);
  const [anyTime, setAnyTime] = useState(false);
  const [selectAllAudits, setAllAudits] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState('');
  const [auditLog, setAuditLog] = useState([]);
  const [csvContent, setCSVContent] = useState('');


  // for adding a new driver dialog
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState('');
  const [userType, setUserType] = useState('');

// for changin points dialog
  const [pointDialogOpen, setPointDialogOpen] = useState(false);
  const [pointsChange, setPointsChange] = useState(0);
  const [pointChangeReason, setPointChangeReason] = useState('');
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
    getDrivers();
  }, [orgID]);

  useEffect(() => {
    async function currentAuthenticatedUser() {
      if (isSpoofing) {
        setUser(sponsorSpoofID);
        console.log("spoof id for sponsor: ", sponsorSpoofID);
      }
      else {
        try {
          const user = await fetchUserAttributes();
          setUser(user);
        } catch (err) {
          console.log(err);
        }
      }
    }
    currentAuthenticatedUser();
  }, []);


  useEffect(() => {

    const getOrgID = async () => { 
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          }
        };
      
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
          if(userType == 'driver'){
            fetch("/api/sponsor/post_add_driver", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
           .catch((error) => console.error(error));
          }
          else{
            fetch("/api/sponsor/post_add_sponsor", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
           .catch((error) => console.error(error));
          }
        }catch(error){
          console.error('Error during sign up:', error);
        }
      }
    
  
     
    if(newUser != '')
      addNewUser(newUser);
  }, [newUser]); // Depend on user state

  const handleCatalogChange = (event, newValue) => {
    setCatalogValue(newValue);
  };

  const handleReportChange = (event, newValue) => {
    setReportValue(newValue);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSelectAllAudits = (event) => {
    setAllAudits(event.target.checked);
  }

  const handleSelectedAudit = (event) => {
    setSelectedAudit(event.target.value);
    setAuditLog([]);
  }

  const handleSubmitPoints = () => {
    if(anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
    if(startDate == 'NaN-NaN-NaN') {
      setStartDate('');
    }
    if(endDate == 'NaN-NaN-NaN') {
      setEndDate('');
    }
    setSubmitted(submitted + 1);
  }

  const handleSubmitAudits = () => {
    if(anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
    if(startDate == 'NaN-NaN-NaN') {
      setStartDate('');
    }
    if(endDate == 'NaN-NaN-NaN') {
      setEndDate('');
    }
    setSubmittedAudit(submittedAudit + 1);
  }

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
    setPointChangeReason('');
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


  const handleAddDriver = (userType) => {
    setAppDialogOpen(true);
   
  };
  const handleAppCloseDialog = () => {
    setAppDialogOpen(false);
  };

  const handleDriverSelect = (event) => {
    setSelectedDriver(event.target.value);
  }

  const handleStartDateChange = (event) => {
    const formattedDate = formatDate(event.target.value);
    setStartDate(formattedDate);
    if(anyTime == true) {
      setStartDate('');
    }
  };

  const handleEndDateChange = (event) => {
    const formattedDate = formatDate(event.target.value);
    setEndDate(formattedDate);
    if(anyTime == true) {
      setEndDate('');
    }
  };

  const handleSelectAllDrivers = (event) => {
    setSelectAllDrivers(event.target.checked);
  }

  const handleAnyTime = (event) => {
    setAnyTime(event.target.checked);
    if(anyTime == true) {
      setStartDate('');
      setEndDate('');
    }
  }

  useEffect(() => {
    if(submitted > 0 && selectAllDrivers != true && anyTime != true) {
      getPointChanges();
    }
    else if(submitted > 0 && selectAllDrivers == true && anyTime != true) {
      getPointChangesAllDrivers();
    }
    else if (submitted > 0 && selectAllDrivers == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getPointChangesAllDrivers();
    }
    else if (submitted > 0 && selectAllDrivers != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getPointChanges();
    }
  }, [submitted]);

  useEffect(() => {
    if(submittedAudit > 0 && selectAllAudits != true && anyTime != true) {
      getAuditLog();
    }
    else if(submittedAudit > 0 && selectAllAudits == true && anyTime != true) {
      getAllAuditLogs();
    }
    else if (submittedAudit > 0 && selectAllAudits == true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAllAuditLogs();
    }
    else if (submittedAudit > 0 && selectAllAudits != true && anyTime == true) {
      setStartDate('');
      setEndDate('');
      getAuditLog();
    }
  }, [submittedAudit]);

  const getAuditLog = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/sponsor/get_audit_log?org_ID=${orgID}&selectedAudit=${selectedAudit}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get audit log');
      }
      const result = await response.json();
      setAuditLog(result);
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
    }
  };

  const getAllAuditLogs = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/sponsor/get_all_audit_logs?org_ID=${orgID}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get all audit logs');
      }
      const result = await response.json();
      setAuditLog(result);
    } catch (error) {
      console.error('Failed to fetch all audit logs:', error);
    }
  };

  const getPointChangesAllDrivers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/sponsor/get_point_changes_all_drivers?org_ID=${orgID}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get point changes');
      }
      const result = await response.json();
      setPointChanges(result);
    } catch (error) {
      console.error('Failed to fetch point changes:', error);
    }
  }

  const getPointChanges = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const response = await fetch(`/api/sponsor/get_point_changes?org_ID=${orgID}&selectedDriver=${selectedDriver}&startDate=${startDate}&endDate=${endDate}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get point changes');
      }
      const result = await response.json();
      setPointChanges(result);
    } catch (error) {
      console.error('Failed to fetch point changes:', error);
    }
  }

  const getDrivers = async () => {
    try {
      const requestOptions = {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      const response = await fetch(`/api/sponsor/get_all_drivers_for_sponsor?org_ID=${orgID}`, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to get drivers');
      }
      const result = await response.json();
      setDrivers(result); // Set "result" as the orders state
    } catch (error) {
      console.error('Failed to fetch drivers:', error);
    }
  };

  const formatDate = (dateString) => {
    let dateObject = new Date(dateString);
    
    // Adjust date for timezone offset
    dateObject.setDate(dateObject.getDate() + 1);
    
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    createCSV();
  }, [auditLog]);

  useEffect(() => {
    createCSV2();
  }, [pointChanges]);

  const createCSV = () => {
    setCSVContent("data:text/csv;charset=utf-8," + auditLog.map(audit => Object.values(audit).join(",")).join("\n"));
  }

  const createCSV2 = () => {
    setCSVContent("data:text/csv;charset=utf-8," + pointChanges.map(point => Object.values(point).join(",")).join("\n"));
  }

  const handleDownload = () => {
    // Prepare CSV content
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload2 = () => {
    // Prepare CSV content
    const encodedURI = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedURI);
    link.setAttribute("download", "point_changes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAppSubmit = () => {

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
          // setUserType(userType);
          
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
          <Tab label="Reports" />
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
                         <TextField
                            autoFocus
                            margin="dense"
                            id="reason"
                            label="Reason"                        
                            fullWidth
                            value={pointChangeReason}
                            onChange={(e) => setPointChangeReason(e.target.value)}
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
                onClick={() => {setUserType('driver');handleAddDriver();}}
              >
                Add Driver
              </Button>
            </form>
            <Typography variant="h4" gutterBottom style={{ marginTop: '16px' }}>
              Add New Sponsor User
            </Typography>
            <form>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {setUserType('sponsor');handleAddDriver();}}
              >
                Add Sponsor
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
            <DialogTitle>Add a New User</DialogTitle>
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
                <Button onClick={() => {handleAppSubmit();}} color="primary">
              Submit
            </Button>
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

        {value === 3 && (
          <>
            <Tabs
              value={reportValue}
              onChange={handleReportChange}
              aria-label="catalog tabs"
              style={{ marginBottom: '20px' }} // Add margin-bottom for spacing
            >
              <Tab label="Point Tracking" />
              <Tab label="Audit Log" />
            </Tabs>

            {/* Tab Panels */}
            {reportValue === 0 && (
  <>
    <FormControlLabel
      control={<Checkbox checked={selectAllDrivers} onChange={handleSelectAllDrivers} />}
      label="All Drivers"
      style={{marginRight: '10px'}}
    />
    <Select
      value={selectedDriver}
      onChange={handleDriverSelect}
      displayEmpty
      disabled={selectAllDrivers} // Disable the select if "All Drivers" or "Any Time" is checked
      style={{ marginBottom: '20px', marginRight: '10px'}}
    >
      <MenuItem value="" disabled={selectAllDrivers}>Select Driver</MenuItem>
      {drivers && drivers.map((driver, index) => (
        <MenuItem key={index} value={driver}>{driver}</MenuItem>
      ))}
    </Select>
    {/* Add Checkbox for "Any Time" */}
    <FormControlLabel
      control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
      label="Any Time"
      style={{marginRight: '10px'}}
    />
    <TextField
      label="Start Date"
      type="date"
      value={startDate}
      onChange={handleStartDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <TextField
      label="End Date"
      type="date"
      value={endDate}
      onChange={handleEndDateChange}
      InputLabelProps={{
        shrink: true,
      }}
      disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
      style={{marginRight: '10px'}}
    />
    <Button variant="contained" color="primary" onClick={handleSubmitPoints} style={{marginRight: '10px'}}>
      Submit
    </Button>
    <Button variant="contained" color="primary" onClick={handleDownload2} style={{marginRight: '10px'}}>
      Download CSV
    </Button>
    {pointChanges.map((pointChange, index) => (
  <Card key={index} style={{ marginBottom: '10px' }}>
    <CardContent>
      <Typography variant="h6" component="h2">
        Point Change ID: {pointChange.point_change_id}
      </Typography>
      <Typography variant="body1" component="p">
        User ID: {pointChange.user_ID}
      </Typography>
      <Typography variant="body1" component="p">
        Name: {pointChange.first_Name}
      </Typography>
      <Typography variant="body1" component="p">
        Point Change Value: {pointChange.point_change_value}
      </Typography>
      <Typography variant="body1" component="p">
        Reason: {pointChange.reason}
      </Typography>
      <Typography variant="body1" component="p">
        Timestamp: {pointChange.timestamp}
      </Typography>
    </CardContent>
  </Card>
))}
  </>
)}
            {reportValue === 1 && (
              <>  
                <Select
                  value={selectedAudit}
                  onChange={handleSelectedAudit}
                  displayEmpty
                  style={{marginRight: '10px'}}
                >
                  <MenuItem value="">Select Audit</MenuItem>
                  <MenuItem value="Driver_App_Audit">Driver App Audit</MenuItem>
                  <MenuItem value="Login_Attempts_Audit">Login Attempts Audit</MenuItem>
                  <MenuItem value="Password_Changes_Audit">Password Changes Audit</MenuItem>
                  <MenuItem value="Point_Changes_Audit">Point Changes Audit</MenuItem>
                </Select>
                <FormControlLabel
                  control={<Checkbox checked={anyTime} onChange={handleAnyTime} />}
                  label="Any Time"
                  style={{marginRight: '10px'}}
                />
                <TextField
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={anyTime} // Disable the Start Date TextField if "Any Time" is checked
                  style={{marginRight: '10px'}}
                />
                <TextField
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled={anyTime} // Disable the End Date TextField if "Any Time" is checked
                  style={{marginRight: '10px'}}
                />
                <Button variant="contained" color="primary" onClick={handleSubmitAudits} style={{marginRight: '10px'}}>
                  Submit
                </Button>
                <Button variant="contained" color="primary" onClick={handleDownload} style={{marginRight: '10px'}}>
                  Download CSV
                </Button>
                {
                  selectedAudit === 'Driver_App_Audit' ? (
                    auditLog.map((audit, index) => (
                      <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Typography variant="h6" component="h2">
                            Driver App ID: {audit.driver_app_id}
                          </Typography>
                          <Typography variant="body1" component="p">
                            User ID: {audit.user_ID}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Name: {audit.first_Name}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Reason: {audit.reason}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Timestamp: {audit.timestamp}
                          </Typography>
                          <Typography variant="body1" component="p">
                            App Status: {audit.app_Status}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : selectedAudit === 'Login_Attempts_Audit' ? (
                    auditLog.map((audit, index) => (
                      <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Typography variant="h6" component="h2">
                            Login Attempts ID: {audit.login_attempts_id}
                          </Typography>
                          <Typography variant="body1" component="p">
                            User ID: {audit.user_ID}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Name: {audit.first_Name}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Status: {audit.status}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Timestamp: {audit.timestamp}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : selectedAudit === 'Password_Changes_Audit' ? (
                    auditLog.map((audit, index) => (
                      <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Typography variant="h6" component="h2">
                            Password Change ID: {audit.password_change_id}
                          </Typography>
                          <Typography variant="body1" component="p">
                            User ID: {audit.user_ID}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Name: {audit.first_Name}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Change Type: {audit.change_type}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Timestamp: {audit.timestamp}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  ) : selectedAudit === 'Point_Changes_Audit' && (
                    auditLog.map((audit, index) => (
                      <Card key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Typography variant="h6" component="h2">
                            Point Change ID: {audit.point_change_id}
                          </Typography>
                          <Typography variant="body1" component="p">
                            User ID: {audit.user_ID}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Name: {audit.first_Name}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Point Change Value: {audit.point_change_value}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Reason: {audit.reason}
                          </Typography>
                          <Typography variant="body1" component="p">
                            Timestamp: {audit.timestamp}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                  )
                }
              </>
            )}
          </>
        )}

      </Container>
    </>
  );
}