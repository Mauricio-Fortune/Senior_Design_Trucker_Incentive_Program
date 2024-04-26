// pages/index.js
import React from 'react';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';
import Layout from '@/Components/Layout';


function Home() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const user = await fetchUserAttributes(); // Adjusted to get the user object directly
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []); // Empty dependency array means this runs once on component mount

  useEffect(() => {
    if (user) {
      console.log("cognito triggered");
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
              user_type: "DRIVER" //update with new cognito instance
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
    }
  }, [user]);

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <main>
        <div style={{ textAlign: 'center' }}>
          {userData && (
            <p
              style={{
                fontSize: '2em', // Increase font size
                fontWeight: 'bold',
                marginTop: '20px', // Increase top margin for separation
                paddingBottom: '20px', // Increase bottom padding
              }}
            >
              Welcome back, {userData.first_Name}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <div
            style={{
              border: '2px solid #333',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              display: 'inline-block',
              overflow: 'hidden',
            }}
          >
            <img
              src="/truck.png"
              alt="Truck"
              style={{
                maxWidth: '100%',
                display: 'block',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '2em', // Increase font size
              fontWeight: 'bold',
              fontFamily: 'cursive', // Use a different font family
              marginTop: '20px', // Increase top margin for separation
              paddingBottom: '20px', // Increase bottom padding
            }}
          >
            You Drive, We Buy
          </p>
        </div>
        {/* Your additional content goes here */}
      </main>
      </Layout>
    </>
  );
}

export default Home;