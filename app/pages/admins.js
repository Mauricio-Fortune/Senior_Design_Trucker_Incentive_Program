import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  TextField, 
  Box, 
  CircularProgress, 
  MenuItem, 
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import AdminPanel from '../Components/admin_panel';
import Account from './account';

function Admin() {
  const [sponsorOrgs, setSponsorOrgs] = useState([]);  
  const [sponsorUsers, setSponsorUsers] = useState([]);
  const [driverUsers, setDriverUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState('');

  const [selectedUser, setSelectedUser] = useState('');
  const [currentDriverId, setCurrentDriverId] = useState(null);

  const [selectedOrgBool, setSelectOrgBool] = useState(false);

  const [newSponsorName, setNewSponsorName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pointsChange, setPointsChange] = useState(0);
  const [behaviorText, setBehaviorText] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);


  const [orgsDialogOpen, setOrgsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [orgsList, setOrgsList] = useState([]);
  const [orgAddOrDelUser, setorgAddOrDelUser] = useState('');

  const [selectedUserUpdate, setUserUpdate] = useState('');
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchSponsorOrgs();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if(sponsorOrgs.length > 0){
      fetchSponsorsInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    setIsLoading(true);
    if(sponsorOrgs.length > 0){
      fetchDriversInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);


  // Idk if this is updating anything
  useEffect(() => {
    console.log("Updated orgs list: ", orgsList);
  }, [orgsList]);


  const fetchSponsorOrgs = async () => {
    try {
      const response = await fetch('/api/driver/get_all_avail_sponsor_companies');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      //console.log('API Response:', data); // Add this line
      setSponsorOrgs(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  };

  const fetchSponsorsInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get_accounts_by_org_name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'SPONSOR'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setSponsorUsers(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  }; 
  
  // Only return drivers who are currently in this org and
  // Have an ACCEPTED app status
  const fetchDriversInSameOrg = async () => {
    try {
      console.log("Org Name:", sponsorOrgs[selectedOrg].org_Name);
      const response = await fetch(`/api/user/get_accounts_by_org_name?org_name=${sponsorOrgs[selectedOrg].org_Name}&user_type=${'DRIVER'}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setDriverUsers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setError('Failed to fetch drivers');
    }
  };  

  const handleOrgChange = (event) => {
    const selectedOrgIndex = event.target.value;
    setSelectedOrg(selectedOrgIndex);
    setSelectOrgBool(true);
  };

  const handleAddSponsor = async () => {
    try {
      const response = await fetch('/api/admin/add_org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ org_Name: newSponsorName }),
      });
      if (!response.ok) {
        throw new Error('Failed to add sponsor');
      }
      const data = await response.json();
      setSponsors([...sponsors, data]);
      setNewSponsorName('');
      setSuccessMessage('Sponsor added successfully');
    } catch (error) {
      console.error('Error adding sponsor:', error);
      setError('Failed to add sponsor');
    }
  };

  // Remove user from org
  const handleRemoveUserFromOrg  = async (userID, orgID) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: userID,
          org_ID : orgID
        })
      };

      // If it is a remove operation
      const response = await fetch(`/api/sponsor/remove_from_org`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }

      if(sponsorOrgs[selectedOrg].org_ID == orgID){
        console.log("The user is being removed")
        const updatedSponsorUsers = sponsorUsers.filter(user => user.user_ID !== userID);
        const updatedDriverUsers = driverUsers.filter(user => user.user_ID !== userID);
        setSponsorUsers(updatedSponsorUsers);
        setDriverUsers(updatedDriverUsers);
      }
      console.log("Setting it now in handleRemoveUserFromOrg");
      setSuccessMessage('User removed from org successfully');
    } catch (error) {
      console.error('Error removing sponsor:', error);
      setError('Failed to remove user');
    }
  }

/***************************************************** */



  const handleEditSponsorOrgs = async (userID) => {
    setSelectedUser(userID);
    setSuccessMessage('');
    setOrgsDialogOpen(true);
  }

  const handleActionChange = async (selectedAction) => {
    
    setActionType(selectedAction);

    if (selectedAction === 'Add') {
      
        // Fetch organizations that the driver is not a part of
        const response = await fetch(`/api/user/get_orgs_not_part_of?user_ID=${selectedUser}`);
        const data = await response.json();

        setOrgsList(data);
    } else if (selectedAction === 'Remove') {

        // Fetch organizations that the driver is a part of
        const response = await fetch(`/api/user/get_orgs_part_of?user_ID=${selectedUser}`);
        const data = await response.json();
        setOrgsList(data);
    }
};

const handleOrgAction = async (orgName) => {
  let orgID;
  try {
    const response = await fetch(`/api/driver/get_orgID_using_name_mauricio?org_Name=${orgName}`);
    if (!response.ok) {
      throw new Error('Failed to fetch orgID');
    }
    const data = await response.json();
    orgID = data[0].org_ID;
  } catch (error) {
    console.error('Error fetching org_ID:', error);
    setError('Failed to fetch org_ID');
  }

  
  if (actionType === 'Add') {
      // API call to add the user to the org
      try {
          const response = await fetch('/api/user/post_add_to_org', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  user_ID: selectedUser,
                  org_ID: orgID
              })
          });
          const result = await response.json();
          if (response.ok) {
              setSuccessMessage('User added to org successfully');
              // Remove the org from the list
              setOrgsList(prevOrgs => prevOrgs.filter(org => org.org_ID !== orgID));
          } else {
              throw new Error(result.message || 'Failed to add user to org');
          }
      } catch (error) {
          console.error('Error adding user to org:', error);
          setError(error.message);
      }
  } else if (actionType === 'Remove') {
      // Similar handling for removing a user from an org
      await handleRemoveUserFromOrg(selectedUser, orgID);
      setSuccessMessage('User removed from org successfully');
  }
};



/***************************************************** */


  const handlePointSubmit = async () => {
    try{
      console.log('Submit button clicked');
      const pointOptions = {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              user_ID : currentDriverId,
              point_change_value : pointsChange,
              reason: behaviorText, 
              org_ID: sponsorOrgs[selectedOrg].org_ID,
              timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            })
      };

        const response = await fetch('/api/sponsor/edit_points', pointOptions);
        console.log('API Response', response);

        if (!response.ok) {
          throw new Error('Failed to update points');
        } 
      
        setSuccessMessage("Points updated successfully");
        console.log("Success Message Set", successMessage);

      }catch (error) {
          console.error('Error updating points', error);
          setError('Failed to update points');
        }

    // Here, add your logic to update the points backend or state
    handleCloseDialog();
  };

  // const handleAlterOrgs = async (userID, orgID) => {
  //   try {
  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         user_ID: userID,
  //         org_ID : orgID
  //       })
  //     };
  //     //console.log("User Deleted" + userID);
  //     // If it is a remove operation
  //     const response = await fetch(`/api/sponsor/remove_from_org`, requestOptions);
      
  //     if (!response.ok) {
  //       throw new Error('Failed to remove sponsor');
  //     }
  //     const updatedSponsorUsers = sponsorUsers.filter(user => user.user_ID !== userID);
  //     const updatedDriverUsers = driverUsers.filter(user => user.user_ID !== userID);
  //     setSponsorUsers(updatedSponsorUsers);
  //     setDriverUsers(updatedDriverUsers);
  //     setSuccessMessage('User removed successfully');
  //   } catch (error) {
  //     console.error('Error removing sponsor:', error);
  //     setError('Failed to remove user');
  //   }
  // }

  // Delete entire account
  const handleDeleteUser = async (userID) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: userID
        })
      };
      //console.log("User Deleted" + userID);
      const response = await fetch(`/api/user/delete_user`, requestOptions);
      
      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }
      const updatedSponsorUsers = sponsorUsers.filter(user => user.user_ID !== userID);
      const updatedDriverUsers = driverUsers.filter(user => user.user_ID !== userID);
      setSponsorUsers(updatedSponsorUsers);
      setDriverUsers(updatedDriverUsers);
      console.log("Setting it now in handleDeleteUser");
      setSuccessMessage('User removed successfully');
    } catch (error) {
      console.error('Error removing sponsor:', error);
      setError('Failed to remove user');
    }
  };

  const handleManagePoints = (driverId) => {
    setCurrentDriverId(driverId);
    setPointsChange(0);  
    setDialogOpen(true);
  };
  
  const handleUpdateCredentials = (spoofId) => {
    setUserUpdate(spoofId);
    setUpdateDialogOpen(true);
  }

  const handleCloseDialog = () => {
    setSuccessMessage('');
    setDialogOpen(false);
  };
  const handleCloseOrgsDialog = () => {
    setSuccessMessage('');
    setOrgsDialogOpen(false);
  };
  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Head>
        <title>Admin Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Typography variant="h3" gutterBottom>
          Admin Dashboard
        </Typography>

        <Typography variant="h4" gutterBottom>
          Select Organization
        </Typography>
        <TextField
          select
          label="Select Organization"
          variant="outlined"
          fullWidth
          margin="normal"
          value={selectedOrg}
          onChange={handleOrgChange} // Define this function to handle changes
        >
          {!isLoading && sponsorOrgs.map((sponsor, index) => (
            <MenuItem key={sponsor.org_Name} value={index}>
              {sponsor.org_Name}
            </MenuItem>
          ))}
        </TextField>

        {!selectedOrg && error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
        {selectedOrgBool && (
          <Typography variant="h4" gutterBottom>
            Sponsors:
          </Typography>
        )}
        {selectedOrgBool && sponsorUsers.map((user) => (
          <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Type: {user.user_Type}</Typography>
              <Typography variant="body1">Name: {user.first_Name}</Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveUserFromOrg(user.user_ID, sponsorOrgs[selectedOrg].org_ID)}
                style={{ marginRight: '8px' }}
              >
                Remove From Org
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'dimgray', color: 'white' }}
                onClick={() => handleUpdateCredentials(user.user_ID)}
              >
                Update Credentials
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'red', color: 'white' }}
                onClick={() => handleDeleteUser(user.user_ID)}
              >
                Delete User
                </Button>
            </CardContent>
          </Card>
        ))}

        {selectedOrgBool && (
          <Typography variant="h4" gutterBottom>
            Drivers:
          </Typography>
        )}
        {selectedOrgBool && driverUsers.map((user) => (
          <Card key={user.user_ID} style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h6">Type: {user.user_Type}</Typography>
              <Typography variant="body1">Name: {user.first_Name}</Typography>
              <Typography variant="body1">Points: {user.total_points}</Typography>
              <Typography variant="body1">Status: {user.app_Status}</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleManagePoints(user.user_ID)}
                style={{ marginRight: '8px' }}
              >
                Manage Points
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleRemoveUserFromOrg(user.user_ID, sponsorOrgs[selectedOrg].org_ID)}
                style={{ marginRight: '8px' }}
              >
                Remove From Org
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'green', color: 'white' }}
                onClick={() => handleEditSponsorOrgs(user.user_ID)}
                //style={{ marginRight: '8px' }}
              >
                Edit Sponsor Organization(s)
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'dimgray', color: 'white' }}
                onClick={() => handleUpdateCredentials(user.user_ID)}
              >
                Update Credentials
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: '8px', backgroundColor: 'red', color: 'white' }}
                onClick={() => handleDeleteUser(user.user_ID)}
              >
                Delete User
              </Button>
            </CardContent>
          </Card>
        ))}
          {/* Points Management Dialog */}
          <Dialog open={dialogOpen} onClose={handleCloseDialog}>
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
                    margin="dense"
                    id="behaviorText" // Unique ID
                    label="Behavior"
                    type="text"
                    fullWidth
                    value={behaviorText}
                    onChange={(e) => setBehaviorText(e.target.value)}
                  />
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseDialog}>Cancel</Button>
                  <Button onClick={handlePointSubmit} color="primary">Submit</Button>
              </DialogActions>
            </Dialog>
          {/* Alter orgs Dialog */}
            <Dialog open ={orgsDialogOpen} onClose={handleCloseOrgsDialog}
            sx={{
                  '& .MuiDialog-paper': { // This targets the inner Paper component
                    minWidth: '500px', // Set a minimum width
                    maxWidth: '90%', // Set a maximum width relative to the viewport
                    width: 'auto', // Auto-adjust to content
                    maxHeight: '80vh' // Set a maximum height relative to the viewport
                  }
                }}>
                <DialogTitle>Manage Orgs</DialogTitle>
                <DialogContent>
                <TextField
              select
              autoFocus
              margin="dense"
              id="action-select"
              label="Action"
              fullWidth
              value={actionType}
              onChange={(e) => handleActionChange(e.target.value)}
            >
                <MenuItem value="Add">Add</MenuItem>
                <MenuItem value="Remove">Remove</MenuItem>
                </TextField>
                  {orgsList.map((org, index) => (
                      <div key={index}>
                          <Typography>{org.org_Name}</Typography>
                          <Button variant="contained" onClick={() => handleOrgAction(org.org_Name)}>
                              {actionType === 'Add' ? 'Add to Org' : 'Remove from Org'}
                          </Button>
                      </div>
                  ))}
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleCloseOrgsDialog}>Cancel</Button>
              </DialogActions>
            </Dialog>


        <Snackbar
          open={!!successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage('')}
          message={successMessage}
        />

        <Dialog open={updateDialogOpen} onClose={handleCloseUpdateDialog}>
          <DialogTitle>Update Account</DialogTitle>
          <DialogContent>
            <Account isSpoof={true} spoofId={selectedUserUpdate} />
          </DialogContent>
        </Dialog>

        {isLoading && (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress />
          </Box>
        )}
        {!error && (
          <Typography variant="body1" color="error" mt={3}>
            {error}
          </Typography>
        )}
        <AdminPanel />
      </Container>
    </React.Fragment>
  );
}

export default Admin;