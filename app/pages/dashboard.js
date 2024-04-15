// pages/dashboard.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DriversPage from './drivers'; // Assuming the file name is drivers.js
import SponsorsPage from './sponsors'; // Assuming the file name is sponsors.js
import AdminsPage from './admins'; // Assuming the file name is admins.js
import ProtectedLayout from '@/Components/ProtectedLayout';
import { fetchUserAttributes } from '@aws-amplify/auth';

function Dashboard() {
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [driverSpoof, setDriverSpoof] = useState(null);
  const [sponsorSpoof, setSponsorSpoof] = useState(null);

  //Set user with credentials
  useEffect(() => {
    async function cognitoCreditials() {
      try {
        const user_credentials = await fetchUserAttributes();
        setUser(user_credentials);
      }
      catch (err) {
        console.log(err)
      }
    }
    cognitoCreditials();

  }, []);

  //Set the userType
  useEffect(() => {
    if (user == null) {
      return;
    }
    if (user['custom:user_type'] == null) {
      setUserType('DRIVER');
      console.log('type is null');
      console.log(user);
    }
    else {
      const typeChar = user['custom:user_type'].toLowerCase()[0];
      if (typeChar == 's') {
        setUserType('SPONSOR');
        console.log('type is sponsor');
      }
      else if (typeChar == 'a') {
        setUserType('ADMIN');
        console.log('type is admin');
      }
      else {
        setUserType('DRIVER');
        console.log('defaulted to driver');
        //default to driver account I guess
      }
    }
  }, [user])

  //Associate Cognito to RDS
  useEffect(() => {
    if (userType == null) {
      return;
    }
    async function cognitoToRDS() {
      try {
        const requestOptions = {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_ID: user.sub,
            email: user.email,
            first_Name: user.name,
            last_Name: "Last Name", //update with new cognito instance
            user_type: userType //update with new cognito instance
          })
        }
        const response = await fetch('/api/user/post_cognito_to_rds', requestOptions);
        console.log(response);
      }
      catch (error) {
        console.error(error);
      }
    }

    cognitoToRDS();
    setIsLoading(false);
  }, [userType])

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedLayout>
      {/* Render appropriate component based on userType */}
      {userType === "DRIVER" && <DriversPage isSpoofing={false}/>}
      {userType === "SPONSOR" && <SponsorsPage isSpoofing={false}/>}
      {userType === "ADMIN" && (
        <>
          <DriversPage isSpoofing={true} driverSpoofID={'70cfd9c1-cab7-4957-80e7-d76ad7c0cc55'} />
          <div style={{ marginBottom: '20px' }}></div>
          <SponsorsPage isSpoofing={true} sponsorSpoofID={'12a24b29-1a15-4c33-ab87-45fe4fdd0abe'} />
          <div style={{ marginBottom: '20px' }}></div>
          <AdminsPage />
          <div style={{ marginBottom: '20px' }}></div>
        </>
      )}
    </ProtectedLayout>
  );
}

export default Dashboard;
