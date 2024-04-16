// pages/account.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedLayout from '@/Components/ProtectedLayout';
import { updatePassword } from 'aws-amplify/auth';
import { fetchUserAttributes } from '@aws-amplify/auth';

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
} from '@mui/material';

export default function Account() {
  const [username, setUsername] = useState('mockuser');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [name, setName] = useState('Mock User');
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes(); // Adjusted to get the user object directly
        setUser(user);
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []); // Empty dependency array means this runs once on component mount

  const handleUsernameChange = () => {
    // Implement logic to change the username
    console.log(`Changing username to: ${username}`);
  };

  const handlePasswordChange = () => {
    async function handleUpdatePassword(oldPassword, newPassword) {
      try {
        await updatePassword({ oldPassword, newPassword });
      } catch (err) {
        console.log(err);
      }
    }
    async function passwordAudit() { // fetches all itemIDs in database
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            change_type: 'Update Password'
          })
      };
      const response = await fetch(`/api/user/password_changes`, requestOptions);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();

    } catch (error) {
      console.error('Failed to update password:', error);
    }
  }

    handleUpdatePassword(password,newPassword);
    console.log('Password Change triggered');

    passwordAudit();
    console.log('Change documented');
  };

  const handleProfilePictureChange = () => {
    // Implement logic to change the profile picture
    console.log('Changing profile picture');
  };

  const handleNameChange = () => {
    // Implement logic to change the name
    console.log(`Changing name to: ${name}`);
  };

  const handleAccountDeletion = () => {
    // Implement logic to delete the account
    console.log('Deleting account');
  };

  return (
    <>
      <Head>
        <title>Account</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProtectedLayout>
      <Container>
        <Typography variant="h3" gutterBottom style={{ marginTop: '16px' }}>
          Account Settings
        </Typography>

        <Card style={{ marginBottom: '16px' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Change Username
            </Typography>
            <TextField
              label="New Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={handleUsernameChange}>
              Change Username
            </Button>
          </CardContent>
        </Card>

        <Card style={{ marginBottom: '16px' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Change Password
            </Typography>
            <TextField
              label="Current Password"
              variant="outlined"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <TextField
              label="New Password"
              variant="outlined"
              fullWidth
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* <Card style={{ marginBottom: '16px' }}>
  <CardContent>
    <Typography variant="h5" gutterBottom>
      Change Profile Picture
    </Typography>
    <TextField
      label="New Profile Picture URL"
      variant="outlined"
      fullWidth
      value={profilePicture}
      onChange={(e) => setProfilePicture(e.target.value)}
      style={{ marginBottom: '8px' }}
    />
    <Button variant="contained" color="primary" onClick={handleProfilePictureChange}>
      Change Profile Picture
    </Button>
  </CardContent>
</Card> */}


        <Card style={{ marginBottom: '16px' }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Change Name
            </Typography>
            <TextField
              label="New Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: '8px' }}
            />
            <Button variant="contained" color="primary" onClick={handleNameChange}>
              Change Name
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Delete Account
            </Typography>
            <Button variant="contained" color="secondary" onClick={handleAccountDeletion}>
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </Container>
      </ProtectedLayout>
    </>
  );
}