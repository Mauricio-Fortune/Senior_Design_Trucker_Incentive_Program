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
import { fetchUserAttributes } from '@aws-amplify/auth';
import { signUp } from 'aws-amplify/auth';
import { ContentCutOutlined } from '@mui/icons-material';

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
  const [createOrgName, setCreateOrgName] = useState('');
  const [createOrgDialogOpen, setCreateOrgDialogOpen] = useState(false);

  // for adding a new driver dialog
  const [appDialogOpen, setAppDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [newUser, setNewUser] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchSponsorOrgs();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (sponsorOrgs.length > 0) {
      fetchSponsorsInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    setIsLoading(true);
    if (sponsorOrgs.length > 0) {
      fetchDriversInSameOrg();
    }
    setIsLoading(false);
  }, [selectedOrg]);

  useEffect(() => {
    console.log("Updated orgs list: ", orgsList);
  }, [orgsList]);

  useEffect(() => {
    async function addNewUser(userId) {

      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
          "user_ID": userId,
          "org_ID": sponsorOrgs[selectedOrg].org_ID,
          "email": email,
          "name": name
        });

        const requestOptions1 = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };
        if (userType == 'driver') {
          fetch("/api/sponsor/post_add_driver", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
        else if (userType == 'sponsor') {
          fetch("/api/sponsor/post_add_sponsor", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
        // Edit here
        else if (userType == 'admin') {
          fetch("/api/sponsor/post_add_admin", requestOptions1)
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error(error));
        }
      } catch (error) {
        console.error('Error during sign up:', error);
      }
    }

    if (newUser != '')
      addNewUser(newUser);
  }, [newUser]); // Depend on user state

  // Obtain all the sponsored orgs
  const fetchSponsorOrgs = async () => {
    try {
      const response = await fetch('/api/driver/get_all_avail_sponsor_companies');
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data = await response.json();
      setSponsorOrgs(data);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
      setError('Failed to fetch sponsors');
    }
  };

  // Obtain all the users in the same org
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

  // handle the org changes
  const handleOrgChange = (event) => {
    const selectedOrgIndex = event.target.value;
    setSelectedOrg(selectedOrgIndex);
    setSelectOrgBool(true);
  };

  // Handle an add sponsor
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
  const handleRemoveUserFromOrg = async (userID, orgID) => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: userID,
          org_ID: orgID
        })
      };

      // If it is a remove operation
      const response = await fetch(`/api/sponsor/remove_from_org`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to remove sponsor');
      }

      if (sponsorOrgs[selectedOrg].org_ID == orgID) {
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

  // Handle editing the sponsored orgs
  const handleEditSponsorOrgs = async (userID) => {
    setSelectedUser(userID);
    setSuccessMessage('');
    setOrgsDialogOpen(true);
  }

  // Handle an add or remove from org
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

  // Get the orgID using the org_Name
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

  // Handle a point submission
  const handlePointSubmit = async () => {
    try {
      console.log('Submit button clicked');
      const pointOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_ID: currentDriverId,
          point_change_value: pointsChange,
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

    } catch (error) {
      console.error('Error updating points', error);
      setError('Failed to update points');
    }

    // Here, add your logic to update the points backend or state
    handleCloseDialog();
  };

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

  // Submit an application to accept the user
  const handleAppSubmit = () => {

    async function handleSignUp(email, password, name, birthdate, userType) {
      console.log("email", email);
      console.log("password", password);
      console.log("name", name);
      console.log("birthdate", birthdate);
      console.log("userType", userType);

      try {
        const { isSignUpComplete, userId, nextStep } = await signUp({
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
    handleSignUp(email, password, name, birthday, userType);

    setAppDialogOpen(false);
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
  // Add drivers or sponsors
  const handleAppCloseDialog = () => {
    setAppDialogOpen(false);
  };

  const handleAddDriver = (userType) => {
    setAppDialogOpen(true);
  };

  // Create an org
  const handleCreateOrg = async () => {
    try {
      const requestOptions = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          org_Name: createOrgName
        })
      };
      //console.log("User Deleted" + userID);
      const response = await fetch(`/api/admin/post_create_org`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to create org');
      }
      console.log("Successfully created org");
      setSuccessMessage('Successfully create org');
    } catch (error) {
      console.error('Error creating org:', error);
      setError('Failed to create org');
    }
  }

  const handleOrgDialogClose = () => {
    setCreateOrgDialogOpen(false);
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
        {/* Add New Sponsored Driver section */}
        {selectedOrgBool && (
          <>
            <Typography variant="h4" gutterBottom style={{ marginTop: '16px' }}>
              Add New Sponsored Driver
            </Typography>
            <form>
              <Button
                variant="contained"
                color="primary"
                onClick={() => { setUserType('driver'); handleAddDriver(); }}
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
                onClick={() => { setUserType('sponsor'); handleAddDriver(); }}
              >
                Add Sponsor
              </Button>
            </form>
            <Typography variant="h4" gutterBottom style={{ marginTop: '16px' }}>
              Add New Admin User
            </Typography>
            <form>
              <Button
                variant="contained"
                color="primary"
                onClick={() => { setUserType('admin'); handleAddDriver(); }}
              >
                Add Admin
              </Button>
            </form>
          </>
        )}
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
        <Dialog open={orgsDialogOpen} onClose={handleCloseOrgsDialog}
          sx={{
            '& .MuiDialog-paper': {
              minWidth: '500px',
              maxWidth: '90%',
              width: 'auto',
              maxHeight: '80vh'
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
        {/* Driver Management Dialog */}
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
            <Button onClick={() => { handleAppSubmit(); }} color="primary">
              Submit
            </Button>
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
        <div style={{ marginTop: '40px' }} />
        <Button variant="contained" onClick={() => setCreateOrgDialogOpen(true)}> Create New Organization</Button>
        <div style={{ marginTop: '40px' }} />

        <Dialog open={createOrgDialogOpen} onClose={handleOrgDialogClose}>
          <DialogContent>
            <Typography variant="h5" gutterBottom>
              Organization Name
            </Typography>
            <TextField
              label="Enter Org Name"
              variant="outlined"
              value={createOrgName}
              fullWidth
              onChange={(e) => setCreateOrgName(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateOrg}>
              Create
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}

export default Admin;