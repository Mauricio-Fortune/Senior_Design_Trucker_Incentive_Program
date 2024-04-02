// pages/index.js
import React from 'react';
import Head from 'next/head';
import ResponsiveAppBar from '../styles/appbar';
import { useEffect, useState } from 'react';
import { fetchUserAttributes } from '@aws-amplify/auth';


function Home() {
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

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ResponsiveAppBar />
      <main>
        <div style={{ textAlign: 'center'}}>
          {user && (
          <p
            style={{
              fontSize: '2em', // Increase font size
              fontWeight: 'bold',
              marginTop: '20px', // Increase top margin for separation
              paddingBottom: '20px', // Increase bottom padding
            }}
          >
            Welcome back, {user.name}
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
    </>
  );
}

export default Home;