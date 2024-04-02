// pages/account.js
import React, { useState } from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../styles/appbar';
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

  const handleUsernameChange = () => {
    // Implement logic to change the username
    console.log(`Changing username to: ${username}`);
  };

  const handlePasswordChange = () => {
    // Implement logic to change the password
    console.log('Changing password');
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
      <ResponsiveAppBar />
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

        <Card style={{ marginBottom: '16px' }}>
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
        </Card>

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
    </>
  );
}