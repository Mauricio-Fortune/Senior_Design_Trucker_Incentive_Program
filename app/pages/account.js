// pages/account.js
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProtectedLayout from '@/Components/ProtectedLayout';
import { updatePassword } from 'aws-amplify/auth';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { signOut } from 'aws-amplify/auth';
import { updateUserAttribute } from 'aws-amplify/auth';

import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from '@mui/material';

export default function Account() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [bio, setBio] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes();
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    if (user == null) {
      return;
    }
    async function getUserData() {
      try {
        const requestOptions = {
          method: "GET",
          headers: {
            'Content-Type': 'application/json'
          },
        };
        const response = await fetch(`/api/user/get_user_from_rds?user_ID=${user.sub}`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setUserData(result[0]);
      } catch (error) {
        console.error('Failed to update password:', error);
      }
    }
    getUserData();
  }, [user]);

  const handlePasswordChange = () => {
    async function handleUpdatePassword(oldPassword, newPassword) {
      try {
        await updatePassword({ oldPassword, newPassword });
      } catch (err) {
        console.log(err);
      }
    }
    async function passwordAudit() {
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
    handleUpdatePassword(password, newPassword);
    console.log('Password Change triggered');

    passwordAudit();
    console.log('Change documented');
  };

  const handleNameChange = () => {
    async function updateCognitoName(attributeKey, value) {
      try {
        const output = await updateUserAttribute({
          userAttribute: {
            attributeKey,
            value
          }
        });
        console.log('Name changed in Cognito');
      } catch (error) {
        console.log(error);
      }
    }
    async function updateRdsName() {
      try {
        const requestOptions = {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            name: name
          })
        };
        const response = await fetch(`/api/user/patch_update_name`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

      } catch (error) {
        console.error('Failed to update bio:', error);
      }
    }
    updateCognitoName('name', name);

    updateRdsName();
    console.log('Name changed in RDS');
  };

  const handleBioChange = () => {
    async function bioChange() {
      try {
        const requestOptions = {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            bio: bio
          })
        };
        const response = await fetch(`/api/user/patch_update_bio`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

      } catch (error) {
        console.error('Failed to update bio:', error);
      }
    }
    bioChange();
    console.log('Bio changed');
  };

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }

  const handleAccountDeletion = () => {
    async function deleteAccount() {
      try {
        const requestOptions = {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
          })
        };
        const response = await fetch(`api/user/patch_deactivate_user`, requestOptions);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();

      } catch (error) {
        console.error('Failed to deactivate account:', error);
      }
    }
    deleteAccount();
    console.log('Account Deactivated');
    handleLogout();
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
                {userData ? "Name: "+userData.first_Name : "Loading..."}
              </Typography>
              <TextField
                label="New Username"
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

          <Card style={{ marginBottom: '16px' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {userData ? (userData.bio ? ("Bio: "+userData.bio) : "Bio: Empty") : "Loading..."}
              </Typography>
              <TextField
                label="New Bio"
                variant="outlined"
                fullWidth
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ marginBottom: '8px' }}
              />
              <Button variant="contained" color="primary" onClick={handleBioChange}>
                Change Bio
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
                Sign Out
              </Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Delete Account
              </Typography>
              <Button variant="contained" color="error" onClick={handleAccountDeletion}>
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Container>
      </ProtectedLayout>
    </>
  );
}